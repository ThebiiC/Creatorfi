import { spawn } from 'node:child_process';

const child = spawn('npx', ['ng', 'serve', ...process.argv.slice(2)], {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe'],
});

let announced = false;

function forward(stream, destination) {
  stream.on('data', (chunk) => {
    const text = chunk.toString();
    destination.write(chunk);
    if (announced) {
      return;
    }

    const match = text.match(/https?:\/\/(?:localhost|127\.0\.0\.1):\d+/);
    if (match && /Local:/i.test(text)) {
      announced = true;
      console.log(`open your browser on ${match[0]}`);
    }
  });
}

forward(child.stdout, process.stdout);
forward(child.stderr, process.stderr);

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
