import mimetypes
from django.conf import settings
from django.http import Http404, HttpResponse
from rest_framework import generics, status
from rest_framework.response import Response
from apiPython.serializers import KeyWordSerializer
from rest_framework.decorators import api_view
from clean_data.index import clean_data
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os


# config error type
RS_OK = (0, 'OK')
RS_REQUEST_TYPEFILE_INVALID = (400, 'error.invalid_typefile')
RS_REQUEST_ERROR_EXECUTE = (500, 'error.error_execute')


def create_response(rs_code=RS_OK, data=None):
    return Response(status=status.HTTP_200_OK, data={
        'code': rs_code[0],
        'message': rs_code[1],
    })

class ReceiveFiles(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        return Response(request.GET)    
#

class UploadFiles(generics.CreateAPIView):
    serializer_class = KeyWordSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data= request.FILES)
        if not serializer.is_valid():
            return Response(data={
                "result": "bad"
            })
        
        req_data = serializer.validated_data
        dataFile = (req_data['dataFile'])
        keywordFile = (req_data['keywordFile'])
        path_data_file = f"./data/{dataFile}"
        path_keyword_file = f"./data/{keywordFile}"
        dataPath = default_storage.save(path_data_file, ContentFile(dataFile.read()))
        keywordPath = default_storage.save(path_keyword_file, ContentFile(keywordFile.read()))
        name, extension = os.path.splitext(dataPath)
        dataPathExtension = extension
        name, extension = os.path.splitext(keywordPath)
        keywordPathExtension = extension
        if(dataPathExtension != '.xlsx' or keywordPathExtension != '.xlsx'):
            os.remove(path_data_file)
            os.remove(path_keyword_file)
            return create_response(rs_code=RS_REQUEST_TYPEFILE_INVALID)
        resultPath = clean_data(keyword_src=keywordPath, data_src=dataPath)
        os.remove(path_data_file)
        os.remove(path_keyword_file)
        return Response(data={
            'path': resultPath
        })

class Download():
    def get(request):
        src = request.GET['path']
        file_path = os.path.join(settings.MEDIA_ROOT, src)
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/vnd.ms-excel")
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
                return response
   
    

