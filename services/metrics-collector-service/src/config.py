from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"
    KAFKA_TOPIC: str = "metrics.raw"
    COLLECTION_INTERVAL: int = 10
    LOG_LEVEL: str = "info"


settings = Settings()
