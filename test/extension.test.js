const assert = require('assert');
const vscode = require('vscode');

suite('Image URL Shortener Extension Test Suite', () => {
	vscode.window.showInformationMessage('Starting all tests.');

	test('URL Shortening Test', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			assert.fail('No active editor');
			return;
		}

		// Insert test content
		await editor.edit((editBuilder) => {
			editBuilder.insert(new vscode.Position(0, 0), '<img src="https://example.com/very/long/path/to/image.jpg" />');
		});

		// Wait for the shortening to occur
		await new Promise(resolve => setTimeout(resolve, 1000));

		// Get the content after shortening
		const content = editor.document.getText();
		assert.strictEqual(content.includes('tinyurl.com'), true, 'URL should be shortened');
	});
});