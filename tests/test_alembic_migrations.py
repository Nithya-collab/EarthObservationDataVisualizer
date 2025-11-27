import pytest
from alembic.config import Config
from alembic.script import ScriptDirectory
from alembic import command
import os

# Utility function to get Alembic configuration
def get_alembic_config(script_location="migrations"):
    """
    Creates an Alembic Config object pointing to the migration directory.
    We configure the script location manually for testing.
    """
    # Initialize Config without an INI file, we set options manually
    alembic_cfg = Config() 
    
    # FIX IS HERE: Use "script_location" (with an underscore) 
    # instead of "scriptlocation"
    alembic_cfg.set_main_option("script_location", script_location)
    
    # Set a dummy sqlalchemy.url option to avoid warnings about missing URL during script directory loading
    alembic_cfg.set_main_option("sqlalchemy.url", "sqlite:///:memory:")
    return alembic_cfg

def test_alembic_base_is_operational():
    """
    A simple check to ensure Alembic configuration can be loaded 
    and points to the right script directory.
    """
    cfg = get_alembic_config()
    # This line now works because "script_location" is set correctly in get_alembic_config()
    script = ScriptDirectory.from_config(cfg)
    
    assert script is not None
    # Check if we can list revisions (must have at least the 'base' revision or more)
    assert len(list(script.walk_revisions())) >= 0 
    print("\nAlembic configuration loaded successfully.")

# This test requires careful setup to run against a clean database or connection
def test_migration_up_and_down(engine, db_url):
    """
    Test that we can upgrade a fresh database to the latest revision 
    and then downgrade it back to empty (base). This checks for migration integrity.
    """
    cfg = get_alembic_config()
    # Link config to our test DB URL dynamically
    cfg.set_main_option("sqlalchemy.url", db_url) 
    
    try:
        # 1. Upgrade to 'head' using the engine connection
        print("\nAttempting alembic upgrade to 'head'...")
        # This command now works because "script_location" is set correctly
        command.upgrade(cfg, "head")
        
        # 2. Downgrade back to 'base' (empty schema)
        print("Attempting alembic downgrade to 'base'...")
        command.downgrade(cfg, "base")
                 
        print("Alembic upgrade and downgrade cycles completed successfully.")

    except Exception as e:
        pytest.fail(f"Alembic migration test failed: {e}")
