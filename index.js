const axios = require('axios');

async function getDailyCommitCount(username, repositories) {
  if (!username || !repositories || !Array.isArray(repositories) || repositories.length === 0) {
    console.error('Invalid input');
    return { total: 0 };
  }
  try {
    const responses = await Promise.all(repositories.map(repository => axios.get(`https://api.github.com/repos/${username}/${repository}/commits`)));
    const commitCounts = responses.map(response => {
      const commits = response.data;
      const today = new Date().toISOString().split('T')[0]; 
      const dailyCommits = commits.filter(commit => commit.commit.author.date.startsWith(today));
      return { repository: response.config.url.split('/').pop(), count: dailyCommits.length };
    });
    const totalCommits = commitCounts.reduce((total, commitCount) => total + commitCount.count, 0);
    return { repositories: commitCounts, total: totalCommits };
  } catch (error) {
    console.error('Error:', error.message);
    return { total: 0 };
  }
}

const username = 'arzucaner';
const repositories = ['easy-life', 'ChirpX', 'goodness-of-nature'];

getDailyCommitCount(username, repositories)
  .then(({ repositories, total }) => {
    console.log('Today\'s commit count:');
    repositories.forEach(({ repository, count }) => console.log(`- ${repository}: ${count}`));
    console.log(`Total: ${total}`);
  })
  .catch(error => console.error('Error:', error.message));