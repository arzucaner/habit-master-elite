const promptUserInput = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your GitHub username: ', (username) => {
    rl.question('Enter the repositories (comma-separated): ', (reposInput) => {
      const repositories = reposInput.split(',').map(repo => repo.trim());
      rl.question('Enter the number of date ranges: ', (rangeCount) => {
        const dateRanges = [];
        const askDateRange = (index) => {
          if (index >= rangeCount) {
            const style = document.createElement('style');
            style.innerHTML = 'input { width: 50%; }';
            document.head.appendChild(style);

            getCommitCount(username, repositories, dateRanges)
              .then((commitCounts) => {
                commitCounts.forEach(({ dateRange, repositories, total }) => {
                  console.log(`Commit count between ${dateRange.startDate} and ${dateRange.endDate}:`);
                  repositories.forEach(({ repository, count }) => console.log(`- ${repository}: ${count}`));
                  console.log(`Total: ${total}`);
                });
                rl.close();
              })
              .catch(error => console.error('Error:', error.message));
          } else {
            rl.question(`Enter start date for range ${index + 1} (YYYY-MM-DD): `, (startDate) => {
              rl.question(`Enter end date for range ${index + 1} (YYYY-MM-DD): `, (endDate) => {
                dateRanges.push({ startDate, endDate });
                askDateRange(index + 1);
              });
            });
          }
        };
        askDateRange(0);
      });
    });
  });
};