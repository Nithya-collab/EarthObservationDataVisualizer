import pytest
from database import get_db_connection
import psycopg2

# Define connection parameters using a pytest fixture for easy reuse
@pytest.fixture(scope="module")
def db_connection_params():
    """Fixture providing database connection parameters."""
    return {
        "db_name": "postgres",
        "db_user": "postgres",
        "db_password": "yourstrongpassword", # !! REPLACE THIS
        "db_host": "localhost",
        "db_port": "5432"
    }

def test_successful_db_connection(db_connection_params):
    """
    Test that we can successfully connect to the database.
    """
    conn = None
    try:
        conn = get_db_connection(**db_connection_params)
        assert conn is not None
        assert isinstance(conn, psycopg2.extensions.connection)
        print("\nSuccessfully connected to DB within test.")
    finally:
        # Ensure the connection is closed after the test runs
        if conn:
            conn.close()

def test_failed_db_connection():
    """
    Test that the function raises an OperationalError with bad credentials.
    """
    with pytest.raises(psycopg2.OperationalError):
        get_db_connection(
            db_name="postgres",
            db_user="baduser",
            db_password="badpassword",
            db_host="localhost",
            db_port="5432"
        )