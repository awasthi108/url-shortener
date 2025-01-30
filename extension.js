const vscode = require("vscode");
const fetch = require("node-fetch");

async function shortenUrl(url) {
  try {
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const shortUrl = await response.text();
    return shortUrl;
  } catch (error) {
    vscode.window.showErrorMessage(`Error shortening URL: ${error.message}`);
    return url;
  }
}

function activate(context) {
  // Watch for document changes
  let disposable = vscode.workspace.onDidChangeTextDocument(async (event) => {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const document = event.document;
      const changes = event.contentChanges;

      for (const change of changes) {
        const text = change.text;
        const srcMatch = text.match(/src=["'](https?:\/\/[^"']+)["']/);

        if (srcMatch) {
          const originalUrl = srcMatch[1];
          const shortUrl = await shortenUrl(originalUrl);

          if (shortUrl !== originalUrl) {
            await editor.edit(
              (editBuilder) => {
                const start = document.positionAt(
                  document.offsetAt(change.range.start) +
                    text.indexOf(originalUrl)
                );
                const end = document.positionAt(
                  document.offsetAt(change.range.start) +
                    text.indexOf(originalUrl) +
                    originalUrl.length
                );
                editBuilder.replace(new vscode.Range(start, end), shortUrl);
              },
              { undoStopBefore: false, undoStopAfter: true }
            );
          }
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        `Error processing changes: ${error.message}`
      );
    }
  });

  context.subscriptions.push(disposable);

  // Watch for document saves
  let saveDisposable = vscode.workspace.onDidSaveTextDocument(
    async (document) => {
      try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const text = document.getText();
        const imgRegex = /src=["'](https?:\/\/[^"']+)["']/g;
        let match;

        const edits = [];
        while ((match = imgRegex.exec(text)) !== null) {
          const originalUrl = match[1];
          const shortUrl = await shortenUrl(originalUrl);

          if (shortUrl !== originalUrl) {
            const startPos = document.positionAt(
              match.index + match[0].indexOf(originalUrl)
            );
            const endPos = document.positionAt(
              match.index + match[0].indexOf(originalUrl) + originalUrl.length
            );
            edits.push({
              range: new vscode.Range(startPos, endPos),
              text: shortUrl,
            });
          }
        }

        if (edits.length > 0) {
          await editor.edit(
            (editBuilder) => {
              edits.reverse().forEach((edit) => {
                editBuilder.replace(edit.range, edit.text);
              });
            },
            { undoStopBefore: false, undoStopAfter: true }
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          `Error processing file save: ${error.message}`
        );
      }
    }
  );

  context.subscriptions.push(saveDisposable);

  // Register command for manual URL shortening
  let shortenCommand = vscode.commands.registerCommand(
    "image-url-shortener.shortenImageUrl",
    async () => {
      try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showInformationMessage("No active editor");
          return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);

        if (text.startsWith("http")) {
          const shortUrl = await shortenUrl(text);
          await editor.edit(
            (editBuilder) => {
              editBuilder.replace(selection, shortUrl);
            },
            { undoStopBefore: false, undoStopAfter: true }
          );
        } else {
          vscode.window.showInformationMessage("Please select a valid URL");
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          `Error shortening URL: ${error.message}`
        );
      }
    }
  );

  context.subscriptions.push(shortenCommand);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
