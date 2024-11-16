from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import nltk
import json
import os
import time
import logging
import sqlalchemy
from neural_mehod import neural_predict_language
from abc_method import abc_predict_language
from fw_method import fw_predict_language
from extract_raw_text import extract_text_from_html
from keyword_ref import keywords_ref
from simple_ref import summarize_text

logging.basicConfig(
    level=logging.INFO,  # Set the log level
    # Set the log format
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("fastapi.log"),  # Log to a file
        logging.StreamHandler()  # Log to the console
    ]
)

logger = logging.getLogger(__name__)


# Load configuration
with open("./src/config.json", "r") as config_file:
    config = json.load(config_file)

# Download necessary NLTK data
nltk.download("stopwords")
nltk.download("punkt")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount static files
app.mount(
    "/static", StaticFiles(directory=os.getcwd().removesuffix('\\src') + '\\'), name="static"
)


@app.get("/", response_class=FileResponse)
async def read_index():
    response = FileResponse(os.getcwd().removesuffix(
        '\\src') + "\\static\\index.html")
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.get("/fw_method")
async def frequency_method(current_file):
    raw_text = current_file
    language = fw_predict_language(raw_text)
    return JSONResponse(content={"language": language})


@app.get('/abc_method')
async def alphabetical_method(current_file):

    raw_text = current_file

    language = abc_predict_language(raw_text)
    return JSONResponse(content={"language": language})


@app.get('/neural_method')
async def neural_method(current_file):
    raw_text = current_file
    language = neural_predict_language(raw_text)
    return JSONResponse(content={"language": language})


@app.get('/keywords_ref')
async def keywords_reference(file_name: str, text: str, language: str) -> JSONResponse:
    keywords = keywords_ref(text, language)
    return JSONResponse(content={"name": file_name, "keywords": keywords})


@app.get('/simple_ref')
async def simple_reference(file_name: str, text: str, language: str) -> JSONResponse:
    reference = summarize_text(text, text.count('.'), language)
    return JSONResponse(content={"name": file_name, "originalText": text, "reference": reference})


@app.get('/access_file_content')
async def get_file(file_name: str) -> JSONResponse:
    result_dict = {"file_name": file_name, "raw_text": ""}
    match file_name.split('.')[-1]:
        case "html":
            try:
                result_dict["raw_text"] = extract_text_from_html(
                    os.getcwd().removesuffix('\\src') + '\\files\\' + file_name)
                logger.debug(
                    os.getcwd().removesuffix('\\src') + '\\files\\' + file_name)
            except:
                result_dict["raw_text"] = ""
                return HTTPException(500, "Error during html unpacking")
        case "txt":
            try:
                with open(os.getcwd().removesuffix('\\src') + '\\files\\' + file_name, 'r', encoding='utf-8') as current_file:
                    logger.debug(
                        os.getcwd().removesuffix('\\src') + '\\files\\' + file_name)
                    result_dict["raw_text"] = current_file.read()
                    logger.debug(current_file.closed)
            except:
                result_dict["raw_text"] = ""
                return HTTPException(500, "Error during txt unpacking")
    return JSONResponse(content=result_dict)


@app.post("/upload_file")
async def upload_file(file: UploadFile = File(...)):
    try:
        upload_folder = "files/"
        os.makedirs(upload_folder, exist_ok=True)
        filename = f"{int(time.time())}_{file.filename}"
        file_path = os.path.join(upload_folder, filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return {"filename": filename}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="main:app",
                host=config["host"], port=config["port"], reload=True)
