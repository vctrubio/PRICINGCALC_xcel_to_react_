import os
import asyncio
import subprocess
from watchgod import awatch

class ServerManager:
    def __init__(self):
        print('init called')
        print(os.getpid())
        self.process = None

    async def run_server(self):
        print('running called')
        print(os.getpid())
        if self.process:
            print('ruin called')
            print(self.process, self.process.poll()) 
            self.process.terminate()
            await asyncio.sleep(1) 
        self.process = subprocess.Popen(["uvicorn", "main:app", "--reload"])
        print('checking.... prodcess.')
        print(self.process, self.process.poll()) 
        
    def print_pid(self):
        print('print_pid called')
        print(os.getpid())
        
    def stop_server(self):
        print('called')
        print(os.getpid())
        if self.process:
            print(self.process, self.process.poll()) 
            print('not showing....')
            self.process.terminate()
            self.process = None

server_manager = ServerManager()

async def main():
    print('Welcome Message')
    file_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.dirname(file_dir)
    print('before')
    asyncio.create_task(server_manager.run_server())
    print('eicas')
    async for changes in awatch(os.path.join(data_dir, 'dataDir')): #cwd
        print(changes)
        asyncio.create_task(server_manager.run_server()) 

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Program terminated by user")
        print(os.getpid())
    except asyncio.exceptions.CancelledError:
        print("Asyncio task cancelled")