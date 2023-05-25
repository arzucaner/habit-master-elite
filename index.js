const axios = require('axios');
const readline = require('readline');

async function getCommitCount(username, repositories, startDate, endDate) {
  if (!username || !repositories || !Array.isArray(repositories) || repositories.length === 0) {
    console.error('Invalid input: Username or repositories missing');
    return { total: 0 };
  }
  if (!startDate || !endDate) {
    console.error('Invalid input: Start date or end date missing');
    return { total: 0 };
  }
  try {
    const responses = await Promise.all(repositories.map(repository => axios.get(`https://api.github.com/repos/${username}/${repository}/commits`)));
    const commitCounts = responses.map(response => {
      const commits = response.data;
      const filteredCommits = commits.filter(commit => {
        const commitDate = new Date(commit.commit.author.date).toISOString().split('T')[0];
        return commitDate >= startDate && commitDate <= endDate;
      });
      return { repository: response.config.url.split('/').pop(), count: filteredCommits.length };
    });
    const totalCommits = commitCounts.reduce((total, commitCount) => total + commitCount.count, 0);
    return { repositories: commitCounts, total: totalCommits };
  } catch (error) {
    console.error('Error:', error.message);
    return { total: 0 };
  }
}

function promptUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your GitHub username: ', (username) => {
    rl.question('Enter the repositories (comma-separated): ', (reposInput) => {
      const repositories = reposInput.split(',').map(repo => repo.trim());
      rl.question('Enter the start date (YYYY-MM-DD): ', (startDate) => {
        rl.question('Enter the end date (YYYY-MM-DD): ', (endDate) => {
          getCommitCount(username, repositories, startDate, endDate)
            .then(({ repositories, total }) => {
              console.log('Commit count between', startDate, 'and', endDate + ':');
              repositories.forEach(({ repository, count }) => console.log(`- ${repository}: ${count}`));
              console.log(`Total: ${total}`);
              rl.close();
            })
            .catch(error => console.error('Error:', error.message));
        });
      });
    });
  });
}

promptUserInput();
