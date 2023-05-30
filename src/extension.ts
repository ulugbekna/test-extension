import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	
	const docSelector : vscode.DocumentSelector =  { scheme: 'file', language: 'typescript' };
	const shareProvider : vscode.ShareProvider = new class implements vscode.ShareProvider {
		id = 'myId';
		label = 'myLabel';
		priority = 1;
		async provideShare(item: vscode.ShareableItem, token: vscode.CancellationToken) {
			const uri = item.resourceUri;
			const selection = item.selection;
			const document = await vscode.workspace.openTextDocument(uri);
			const text = selection ? document.getText(selection) : document.getText();
			const googleSearchLink = this.toGoogleSearchLink(text);
			return googleSearchLink;
		}
		private toGoogleSearchLink(query: string): vscode.Uri {
			const uri = vscode.Uri.parse('https://www.google.com/search');
			const r = uri.with({
				query: `q=${query}`
			});
			return r;
		}
	};
	const shareProviderDisposable= vscode.window.registerShareProvider(docSelector, shareProvider);
	context.subscriptions.push(shareProviderDisposable);
}


export function deactivate() {}
