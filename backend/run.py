import asyncio
import subprocess
from watchgod import awatch

class ServerManager:
    def __init__(self):
        self.process = None

    async def run_server(self):
        if self.process:
            self.process.terminate()
            await asyncio.sleep(1) 
        self.process = subprocess.Popen(["uvicorn", "main:app", "--reload"])

async def main():
    print('Welcome Message')
    server_manager = ServerManager()
    asyncio.create_task(server_manager.run_server()) 
    async for changes in awatch('../dataDir/'):
        print(changes)
        asyncio.create_task(server_manager.run_server()) 

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Program terminated by user")
    except asyncio.exceptions.CancelledError:
        print("Asyncio task cancelled")