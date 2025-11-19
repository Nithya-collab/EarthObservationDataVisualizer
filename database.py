# database.py
import psycopg2
from psycopg2 import OperationalError

def get_db_connection(db_name, db_user, db_password, db_host, db_port):
    """
    Attempts to establish a connection to the PostgreSQL database.
    Raises OperationalError if connection fails.
    """
    connection = None
    try:
        connection = psycopg2.connect(
            database=db_name,
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port
        )
        return connection
    except OperationalError as e:
        # In a real TDD scenario, you might just let this exception propagate
        # to confirm the test fails correctly.
        print(f"Connection failed: {e}")
        raise e

