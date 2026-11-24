from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    DATABASE_URL: str = "postgresql+psycopg://app:app@db:5432/app"
    SECRET_KEY: str = "change-me"
    SMTP_HOST: str | None = None
    SMTP_PORT: int = 587
    EMAILS_FROM: str = "noreply@example.com"


settings = Settings()
