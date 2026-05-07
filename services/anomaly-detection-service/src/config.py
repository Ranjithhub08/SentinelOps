from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"
    LOGS_TOPIC: str = "logs.raw"
    METRICS_TOPIC: str = "metrics.raw"
    ANOMALY_THRESHOLD: float = 2.0
    LOG_LEVEL: str = "info"


settings = Settings()
