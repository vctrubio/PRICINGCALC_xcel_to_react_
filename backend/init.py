import os
import signal
import asyncio
import subprocess
import traceback
from watchgod import awatch

class ServerManager:
    def __init__(self):
        print('init called', os.getpid())
        self.process = None

    async def run_server(self):
        if self.process:
            self.process.terminate()
            self.process.wait()
            await asyncio.sleep(1) 
        try:
            self.process = subprocess.Popen(["uvicorn", "main:app", "--reload"])
        except Exception as e:
            print(f"Failed to start server: {e}")

    def stop_server(self):
        if self.process:
            print('not showing....')
            if self.process.poll() is None:
                self.process.terminate()
            self.process = None

server_manager = None

async def main():
    global server_manager
    server_manager = ServerManager()
    
    print('Welcome Pitu')
    data_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    asyncio.create_task(server_manager.run_server())
    async for changes in awatch(os.path.join(data_dir, 'dataDir')): 
        print(f'reload: {changes}')
        asyncio.create_task(server_manager.run_server()) 

async def stop():
    global server_manager
    if server_manager:
        server_manager.stop_server()
    os.kill(os.getpid(), signal.SIGINT)
    
if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Program terminated by user")
        print(os.getpid())
    except asyncio.exceptions.CancelledError:
        print("Asyncio task cancelled")
    print('With Warme...')
