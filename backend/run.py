import os
import asyncio
import subprocess
from watchgod import awatch

import asyncio
import os
import subprocess

#calling init.py atm
class ServerManager:
    def __init__(self):
        print('init called', os.getpid())
        self.process = None

    async def run_server(self):
        if self.process:
            print('terminating process')
            print(self.process, self.process.poll()) 
            self.process.terminate()
            # Wait for the process to terminate
            self.process.wait()
            await asyncio.sleep(1) 
        try:
            self.process = subprocess.Popen(["uvicorn", "main:app", "--reload"])
            print(self.process, self.process.poll()) 
        except Exception as e:
            print(f"Failed to start server: {e}")

    def print_pid(self):
        print(os.getpid())
        
    def stop_server(self):
        print(os.getpid())
        if self.process:
            print(self.process, self.process.poll()) 
            print('not showing....')
            # Check if the process is still running before trying to terminate it
            if self.process.poll() is None:
                self.process.terminate()
            self.process = None

server_manager = ServerManager()

async def main():
    print('Welcome Pitu')
    file_dir = os.path.dirname(os.path.abspath(__file__))
    print(file_dir)
    data_dir = os.path.dirname(file_dir)
    asyncio.create_task(server_manager.run_server())
    async for changes in awatch(os.path.join(data_dir, 'dataDir')): 
        print(f'reload: {changes}')
        asyncio.create_task(server_manager.run_server()) 

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Program terminated by user")
        print(os.getpid())
    except asyncio.exceptions.CancelledError:
        print("Asyncio task cancelled")
    print('With Warme...')
