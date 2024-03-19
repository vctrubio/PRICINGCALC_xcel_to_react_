import os
import asyncio
import socket
import signal
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
        # print('checking.... prodcess.')
        # print(self.process, self.process.poll()) 
        
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
    print('\033[33m' + 'Welcome Pitu' + '\033[0m')
    file_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.dirname(file_dir)
    print('before')
    asyncio.create_task(server_manager.run_server())
    print('eicas')
    async for changes in awatch(os.path.join(data_dir, 'dataDir')): #cwd
        # print(changes)
        asyncio.create_task(server_manager.run_server()) 


def check_and_kill_port(port=8000, flag=False):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        if s.connect_ex(('localhost', port)) == 0:
            print(f"Port {port} is open. Attempting to kill the process using it.")
            result = subprocess.check_output(f'lsof -i :{port} | awk \'{{print $2}}\'', shell=True).split()
            pids = [pid.decode('utf-8') for pid in result[1:]]  # Skip the first element which is 'PID'
            for pid in pids:
                os.kill(int(pid), signal.SIGKILL)

            
if __name__ == '__main__':
    try:
        check_and_kill_port()
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Program terminated by user")
        # print(os.getpid())
    except asyncio.exceptions.CancelledError:
        print("Asyncio task cancelled")