const root = document.getElementById('root');

if (!root) {
  throw new Error('#root element not found');
}

const heading = document.createElement('h1');
heading.textContent = 'CharacterLab';

const statusMessage = document.createElement('p');
statusMessage.textContent = 'North-Star architectural refoundation in progress.';

root.append(heading, statusMessage);

export {};
