from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Get the database URL from environment variables for security/flexibility
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:yourstrongpassword@localhost:5432/postgres")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Helper function to get a DB session
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()