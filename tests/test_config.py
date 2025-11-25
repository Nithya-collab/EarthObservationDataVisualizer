# conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base

# In a real app, you would import this from your application's database module
Base = declarative_base() 

# Define a fixture to create an in-memory or dedicated test database URL
@pytest.fixture(scope="session")
def db_url():
    # Use a separate test database for isolation
    return "postgresql://postgres:yourstrongpassword@localhost:5432/test_geodb"

@pytest.fixture(scope="session")
def engine(db_url):
    """Provides a SQLAlchemy engine connected to the test database."""
    return create_engine(db_url)

@pytest.fixture(scope="session")
def tables(engine):
    """Creates all tables defined in Base before tests and drops them after."""
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)

@pytest.fixture
def db_session(engine, tables):
    """Provides a transactional database session for each test."""
    connection = engine.connect()
    transaction = connection.begin()
    # Bind a session to the connection, ensuring it uses the transaction
    session = Session(bind=connection)
    
    yield session
    
    session.close()
    # Roll back the transaction to leave the database clean for the next test
    transaction.rollback()
    connection.close()
