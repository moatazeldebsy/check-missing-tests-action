const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

(async () => {
  try {
    const token = process.env.INPUT_GITHUB_TOKEN;
    const octokit = new Octokit({ auth: token });

    const repoOwner = process.env.GITHUB_REPOSITORY.split("/")[0];
    const repoName = process.env.GITHUB_REPOSITORY.split("/")[1];
    const prNumber = process.env.GITHUB_REF.split("/")[2];

    const { data: files } = await octokit.pulls.listFiles({
      owner: repoOwner,
      repo: repoName,
      pull_number: prNumber,
    });

    const newFunctions = [];
    const filesWithNewFunctions = [];
    const filesWithTests = [];

    files.forEach((file) => {
      if (file.filename.endsWith(".js") || file.filename.endsWith(".ts")) {
        const filePath = path.join(process.cwd(), file.filename);
        const content = fs.readFileSync(filePath, "utf-8");

        const matches = content.match(/function\s+\w+\(|\w+\s*=\s*\(.*\)\s*=>/g);
        if (matches) {
          newFunctions.push(...matches);
          filesWithNewFunctions.push(file.filename);
        }

        if (file.filename.includes(".test.") || file.filename.includes("tests")) {
          filesWithTests.push(file.filename);
        }
      }
    });

    const filesWithoutTests = filesWithNewFunctions.filter(
      (file) => !filesWithTests.some((testFile) => testFile.includes(path.basename(file)))
    );

    if (filesWithoutTests.length > 0) {
      const commentBody = `
        🚨 **The following files introduce new functions without corresponding unit tests:**
        ${filesWithoutTests.map((file) => `- ${file}`).join("\n")}

        Please add tests for all new functions.
      `;

      await octokit.issues.createComment({
        owner: repoOwner,
        repo: repoName,
        issue_number: prNumber,
        body: commentBody,
      });

      console.log("Comment added to PR.");
    } else {
      console.log("No files are missing tests.");
    }
  } catch (error) {
    console.error("Error running the GitHub Action:", error.message);
    process.exit(1);
  }
})();
