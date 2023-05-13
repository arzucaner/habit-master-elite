const readline = require('readline');

class ChallengeApp {
  constructor() {
    this.readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  start() {
    this.readlineInterface.question('Do you want to make a daily commit? (Y/N): ', function(answer) {
      if (answer.toLowerCase() === 'y') {
        this.commit();
      } else if (answer.toLowerCase() === 'n') {
        console.log('Program terminated.');
        this.readlineInterface.close();
      } else {
        console.log('Invalid response. Please answer with "Y" or "N".');
        this.start();
      }
    }.bind(this));
  }

  commit() {
    console.log('Commit made! You did a great job today👏👏👏');
    this.start();
  }
}

const app = new ChallengeApp();
app.start();
