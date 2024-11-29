import * as vscode from "vscode";
import { symbols, subs, sups } from "./data";
import { generateAlphanumericData } from "./alphanumeric";

export function activate(context: vscode.ExtensionContext) {
	const mathematicalSymbols = (() => {
		const minimumCompletionLength = vscode.workspace
			.getConfiguration()
			.get("mathematicalSymbols.minimumCompletionLength") as number;
		const useCache = vscode.workspace
			.getConfiguration()
			.get("mathematicalSymbols.useCache") as boolean;

		const cachedSymbols =
			context.globalState.get<Record<string, string>>("cachedSymbols");
		const cachedPrefixSymbolTableData = context.globalState.get<
			Record<string, Record<string, string>>
		>("cachedPrefixSymbolTableData");

		if (useCache && cachedSymbols && cachedPrefixSymbolTableData) {
			return new MathematicalSymbols(
				cachedSymbols,
				cachedPrefixSymbolTableData,
				subs,
				sups,
				minimumCompletionLength,
			);
		} else {
			const { alphanumerics, prefixSymbolTableData } =
				generateAlphanumericData();
			const symbolsMerged = { ...alphanumerics, ...symbols };
			if (useCache) {
				context.globalState.update("cachedSymbols", symbolsMerged);
				context.globalState.update(
					"cachedPrefixSymbolTableData",
					prefixSymbolTableData,
				);
			}
			return new MathematicalSymbols(
				symbolsMerged,
				prefixSymbolTableData,
				subs,
				sups,
				minimumCompletionLength,
			);
		}
	})();

	const enabledLanguages = vscode.workspace
		.getConfiguration()
		.get("mathematicalSymbols.enabledLanguages") as string[];
	for (const language of enabledLanguages) {
		context.workspaceState.update(
			`mathematical-symbols-active-${language}`,
			true,
		);
	}

	if (mathematicalSymbols.minimumCompletionLength >= 0) {
		context.subscriptions.push(
			vscode.languages.registerCompletionItemProvider(
				"*",
				{
					provideCompletionItems: (document, position) =>
						context.workspaceState.get<boolean>(
							`mathematical-symbols-active-${document.languageId}`,
						)
							? mathematicalSymbols.provideCompletionItems(document, position)
							: [],
				},
				"\\",
			),
		);
	}

	context.subscriptions.push(
		vscode.commands.registerCommand("mathematical-symbols.commit_tab", () => {
			const language = vscode.window.activeTextEditor?.document?.languageId;
			if (language)
				context.workspaceState.get<boolean>(
					`mathematical-symbols-active-${language}`,
				)
					? mathematicalSymbols.commit("tab")
					: vscode.commands.executeCommand("tab");
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("mathematical-symbols.commit_space", () => {
			const language = vscode.window.activeTextEditor?.document?.languageId;
			if (language)
				context.workspaceState.get<boolean>(
					`mathematical-symbols-active-${language}`,
				)
					? mathematicalSymbols.commit("space")
					: vscode.commands.executeCommand("type", {
						source: "keyboard",
						text: " ",
					});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("mathematical-symbols.flush_cache", () => {
			context.globalState.update("cachedSymbols", undefined);
			context.globalState.update("cachedPrefixSymbolTableData", undefined);
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("mathematical-symbols.enable", () => {
			const language = vscode.window.activeTextEditor?.document?.languageId;
			if (language)
				context.workspaceState.update(
					`mathematical-symbols-active-${language}`,
					true,
				);
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("mathematical-symbols.disable", () => {
			const language = vscode.window.activeTextEditor?.document?.languageId;
			if (language)
				context.workspaceState.update(
					`mathematical-symbols-active-${language}`,
					false,
				);
		}),
	);
}

export function deactivate() { }

class MathematicalSymbols {
	private keys: string[];

	constructor(
		private symbols: Record<string, string>,
		private prefixSymbolTableData: Record<string, Record<string, string>>,
		private subs: Record<string, string>,
		private sups: Record<string, string>,
		public minimumCompletionLength: number,
	) {
		this.keys = Object.keys(symbols);
	}

	public async provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
	) {
		const target = this.getTarget(document, position);
		if (!target || target.word.length < this.minimumCompletionLength) {
			return;
		}
		let matches = this.keys.filter((k: string) => k.startsWith(target.word));
		return matches.map((key: string) => {
			const item = new vscode.CompletionItem(
				`\\${key}`,
				vscode.CompletionItemKind.Text,
			);
			item.detail = this.symbols[key];
			item.insertText = this.symbols[key];
			item.range = target.range;
			return item;
		});
	}

	public commit(key: "space" | "tab") {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		let is_changed = false;
		editor.edit((editor_edit: vscode.TextEditorEdit) => {
			editor.selections.map((selection) => {
				const target = this.getTarget(editor.document, selection.active);
				if (target) {
					const replaced = this.replace(target.word, key == "space" ? " " : "");
					if (replaced) {
						editor_edit.replace(target.range, replaced);
						is_changed = true;
					}
				}
			});
		});

		if (key == "space") {
			return vscode.commands.executeCommand("type", {
				source: "keyboard",
				text: " ",
			});
		}
		if (!is_changed) {
			return vscode.commands.executeCommand(key);
		}
		return;
	}

	private getTarget(document: vscode.TextDocument, position: vscode.Position) {
		if (position.character === 0) {
			return;
		}

		const cursor_prefix = document.getText(
			new vscode.Range(new vscode.Position(position.line, 0), position),
		);
		const trigger_index = cursor_prefix.lastIndexOf("\\");
		if (trigger_index == -1) {
			return;
		}

		const word = cursor_prefix.substring(trigger_index + 1).trim();
		const range = new vscode.Range(
			new vscode.Position(position.line, trigger_index),
			position,
		);
		return { range, word };
	}

	private replace(word: string, separator: string = ""): string | undefined {
		if (word.endsWith(";") || word.endsWith(",")) {
			return this.replace(word.substring(0, word.length - 1), separator);
		}

		let allMatch = true;
		const replaced = word
			.split(",")
			.map((part) => {
				if (part.length == 0) return "";

				const splitted = part.split(";");

				if (splitted.length == 1) {
					if (part in this.symbols) {
						return this.symbols[part];
					}

					let match =
						part.match(/^_([^_]+)$/) ||
						part.match(/^([^_]+)_$/) ||
						part.match(/^_([^_]+)_$/);
					if (match)
						return (
							this.subs[match[1]] ??
							match[1]
								.split("")
								.map((c, _) => this.subs[c] ?? c)
								.join(separator)
						);

					match =
						part.match(/^\^([^^]+)$/) ||
						part.match(/^([^^]+)\^$/) ||
						part.match(/^\^([^^]+)\^$/);
					if (match)
						return (
							this.sups[match[1]] ??
							match[1]
								.split("")
								.map((c, _) => this.sups[c] ?? c)
								.join(separator)
						);

					match = part.match(/^!([^!]+)$/) || part.match(/^([^!]+)!$/);
					if (match && (match[1] in this.symbols || match[1].length == 1))
						return `${this.symbols[match[1]] ?? match[1]}\u{0338}`.normalize();
				}

				if (splitted.length == 2) {
					const prefix = splitted[0];
					const word = splitted[1];

					let symbolTable: Record<string, string> = {};
					for (let i = 0; i < prefix.length; i++) {
						let p = prefix.slice(0, prefix.length - i);
						if (p in this.prefixSymbolTableData) {
							symbolTable = this.prefixSymbolTableData[p];
							break;
						}
					}

					return (
						symbolTable[word] ??
						word
							.split("")
							.map((c, _) => symbolTable[c] ?? c)
							.join(separator)
					);
				}

				allMatch = false;
				return;
			})
			.join(separator);

		return allMatch ? replaced : undefined;
	}
}
