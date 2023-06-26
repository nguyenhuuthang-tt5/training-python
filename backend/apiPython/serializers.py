from django.forms import FileField
from rest_framework import serializers

class KeyWordSerializer(serializers.Serializer):
    dataFile = serializers.FileField(required=True)
    keywordFile = serializers.FileField(required=True)
    #
    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass