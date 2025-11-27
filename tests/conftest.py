# conftest.py
import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base # Keep this import here

# --- GLOBAL BASE OBJECT ---
# This single Base instance will be used by all models defined in your application
Base = declarative_base() 

# Define a fixture to create an in-memory or dedicated test database URL
@pytest.fixture(scope="session")
def db_url():
    # Use a separate test database for isolation
    return "postgresql://postgres:yourstrongpassword@localhost:5432/test_geodb"

@pytest.fixture(scope="session")
def engine(db_url):
    """Provides a SQLAlchemy engine connected to the test database and initializes PostGIS."""
    # We add a connection argument to run a function immediately after connect
    engine = create_engine(db_url)

    # --- ADD THIS EVENT LISTENER ---
    @event.listens_for(engine, "connect")
    def connect(dbapi_connection, connection_record):
        """Handler to enable PostGIS functionality immediately on connect."""
        cursor = dbapi_connection.cursor()
        # This command is crucial for registering GeoAlchemy2 types in the session
        cursor.execute("SELECT postgis_full_version();") 
        cursor.close()
    # -------------------------------

    return engine

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
