from django.forms import FileField
from rest_framework import serializers

class ResultSerializer(serializers.Serializer):
    resultFile = serializers.FileField(upload_to="")
    #
    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass