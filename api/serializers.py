from django.contrib.auth import get_user_model
from rest_framework import serializers


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name"]

    def validate_email(self, value: str):
        value = (value or "").strip().lower()
        if not value:
            raise serializers.ValidationError("Email is required.")
        qs = User.objects.filter(email__iexact=value)
        if self.instance is not None:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def update(self, instance, validated_data):
        email = validated_data.get("email")
        if email and email != instance.email:
            instance.email = email
            instance.username = email  # keep username equal to email
        first_name = validated_data.get("first_name")
        last_name = validated_data.get("last_name")
        if first_name is not None:
            instance.first_name = first_name.strip()
        if last_name is not None:
            instance.last_name = last_name.strip()
        instance.save()
        return instance


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate_email(self, value: str):
        value = (value or "").strip().lower()
        if not value:
            raise serializers.ValidationError("Email is required.")
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_password(self, value: str):
        if value is None or len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def create(self, validated_data):
        email = validated_data.get("email").lower()
        first_name = (validated_data.get("first_name") or "").strip()
        last_name = (validated_data.get("last_name") or "").strip()
        password = validated_data.get("password")

        user = User(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
