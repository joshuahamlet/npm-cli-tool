import React, { FC, useState } from "react";
import { Box, Text, useInput, Newline, useApp, Spacer } from "ink";
import TextInput from "ink-text-input";
const axios = require("axios").default;
import { install } from "pkg-install";
import Spinner from "ink-spinner";
import Markdown from "ink-markdown"

const App: FC<{ name?: string }> = () => {
	//const [text, _setText] = useState<string[][]>([]);
	const [query, setQuery] = useState("");
	const [choice, setChoice] = useState<any>();
	const [mainOption, setMainOption] = useState(1);
	const [searchResult, setSearchResult] = useState<any>({
		active: false,
		packages: [],
	});
	const [searchOption, setSearchOption] = useState(1);
	const [searchPage, setSearchPage] = useState(1)
	const [loading, setLoading] = useState<any>([false, null]);
	const [downloadStatus, setDownloadStatus] = useState();
	const [errorState, setErrorState] = useState();
	const [markdownVisible, setMarkdownVisible] = useState<any>({visible: false, sections: [], pointer: 0});

	const { exit } = useApp();

	useInput((input, key) => {
		if (key.escape) {
			exit();
		}
		if ((key || input) && downloadStatus) {
			setDownloadStatus(undefined);
			return;
		}
		if (key.leftArrow && mainOption > 1 && choice) {
			setMainOption((p) => p - 1);
		}
		if (key.rightArrow && mainOption < 4 && choice) {
			setMainOption((p) => p + 1);
		}
		if (
			key.rightArrow &&
			searchResult.active &&
			searchPage < searchResult.packages.length / 5
		) {
			setSearchPage((p) => p + 1);
		}
		if (key.leftArrow && searchResult.active && searchPage > 1) {
			setSearchPage((p) => p - 1);
		}
		if (key.upArrow && !markdownVisible.visible && searchOption > 1) {
			setSearchOption((p) => p - 1);
		}
		if (key.downArrow && !markdownVisible.visible && searchOption < 5) {
			setSearchOption((p) => p + 1);
		}
		/////////////////
		if (key.downArrow && markdownVisible.visible && markdownVisible.pointer < (markdownVisible.sections.length -1)) {
			setMarkdownVisible((p:any) => ({...p, pointer: p.pointer + 1}));
			//console.log(markdownVisible.pointer)
		}
		if (key.upArrow && markdownVisible.visible && markdownVisible.pointer >= 1) {
			setMarkdownVisible((p:any) => ({...p, pointer: p.pointer - 1}))
			//console.log(markdownVisible.pointer)
		}
		if (
			(key.return && !searchResult.active && choice && mainOption === 4) ||
			(input === "4" && !searchResult.active && choice)
		) {
			//console.log(markdownVisible)
			let sections = "readme" in choice.collected.metadata ? choice.collected.metadata.readme.split('\n## ') : ['🤷 No Readme info available...']
			setMarkdownVisible((p:any) => ({...p, visible: !p.visible, sections: [...sections]}))
		}
		if (key.backspace|| key.delete && searchResult.active) {
			console.log(key.backspace)
			console.log(searchResult)
			setSearchResult((p: any) => ({ ...p, active: false }));
		}
		/////////////////
		if (
			(key.return && !searchResult.active && choice && mainOption === 3) ||
			(input === "3" && !searchResult.active && choice)
		) {
			setChoice(undefined);
			setDownloadStatus(undefined);
			setMarkdownVisible({visible: false, sections: [], pointer: 0})
		}
		if (
			(key.return && !searchResult.active && choice && mainOption === 2) ||
			(input === "2" && !searchResult.active && choice)
		) {
			setMarkdownVisible((p:any) => ({...p, visible: false}))
			setDownloadStatus(undefined);
			dlHandler();
		}
		if (
			(key.return && !searchResult.active && choice && mainOption === 1) ||
			(input === "1" && !searchResult.active && choice)
		) {
			setMarkdownVisible({visible: false, sections: [], pointer: 0})
			setSearchResult((p: any) => ({ ...p, active: true }));
			setDownloadStatus(undefined);
			setChoice(undefined);
		}
		if (key.return && searchResult.active) {
			// console.log(
			// 	"#########################################################################################################################################3",
			// 	searchResult[searchOption]
			// );
			//setChoice(searchResult.packages[searchOption - 1 + (searchPage - 1) * 5].package.name);
			//console.log(searchResult.packages[searchOption - 1 + (searchPage - 1) * 5].package.name)
			setSearchResult((p: any) => ({ ...p, active: false }));
			setSearchOption(1);
			setSearchPage(1);
			setLoading([true, ' Loading...']);
			axios
			.get(`https://api.npms.io/v2/package/${searchResult.packages[searchOption - 1 + (searchPage - 1) * 5].package.name}`)
			.then(function (response: any) {
				//console.log(response.data)
				setChoice(response.data)
				setLoading([false, null]);
			})
		}
		if (input === "1" && searchResult.active) {
			setChoice(searchResult.packages[1 - 1 + (searchPage - 1) * 5]);
			setSearchResult((p: any) => ({ ...p, active: false }));
			setSearchOption(1);
			setSearchPage(1);
		}
		if (input === "2" && searchResult.active) {
			setChoice(searchResult.packages[2 - 1 + (searchPage - 1) * 5]);
			setSearchResult((p: any) => ({ ...p, active: false }));
			setSearchOption(1);
			setSearchPage(1);
		}
		if (input === "3" && searchResult.active) {
			setChoice(searchResult.packages[3 - 1 + (searchPage - 1) * 5]);
			setSearchResult((p: any) => ({ ...p, active: false }));
			setSearchOption(1);
			setSearchPage(1);
		}
		if (input === "4" && searchResult.active) {
			setChoice(searchResult.packages[4 - 1 + (searchPage - 1) * 5]);
			setSearchResult((p: any) => ({ ...p, active: false }));
			setSearchOption(1);
			setSearchPage(1);
		}
		if (input === "5" && searchResult.active) {
			setChoice(searchResult.packages[5 - 1 + (searchPage - 1) * 5]);
			setSearchResult((p: any) => ({ ...p, active: false }));
			setSearchOption(1);
			setSearchPage(1);
		}
	});

	const submitHandler = () => {
		//console.log("QUERY", query);
		setLoading([true, " Searching..."]);
		axios
			.get(`https://api.npms.io/v2/search?q=${query}`)
			.then(function (response: any) {
				// handle success
				setLoading([false, null]);
				//console.log(response.data.results);
				//console.log(response.data.results[0]);
				if (response.data.results) {
					setSearchResult({ active: true, packages: response.data.results });
					setMainOption(1);
					//console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", response.data.results);
					setSearchOption(1);
				}
			})
			.catch(function (error: any) {
				// handle error
				console.log("ERROR STATUS!!!", error.response.status);
				setErrorState(error.response.status);
				setChoice(null);
			});
		setQuery("");
	};

	const dlHandler = () => {
		setLoading([true, " Downloading..."]);
		let packageInfo: any = {};
		packageInfo[choice.collected.metadata.name] = "latest";
		(async () => {
			const { stdout } = await install(packageInfo, {
				dev: true,
				prefer: "npm",
				verbose: true,
			});
			setLoading([false, null]);
			setDownloadStatus(stdout);
		})();
	};

	return (
		<>
			<Box
				alignItems="center"
				justifyContent="center"
				borderStyle="bold"
				borderColor="red"
			>
				<Text backgroundColor="red" color="white">
					*** NPM CLI TOOL ***
				</Text>
			</Box>

			<Box borderStyle="round" borderColor="green" flexDirection="column">
				{choice && !searchResult.active ? (
					<>
						<Box flexDirection='row'>
							<Text>{choice && choice.collected.metadata.name + " "}</Text>
							<Text color="blue">{choice && choice.collected.metadata.version}</Text>
							<Spacer/>
							<Box paddingRight={2} >
								<Text color='green'>Github Stats| </Text>
								<Text>⭐ {choice.collected.github.starsCount}</Text>
								<Text>🍴 {choice.collected.github.forksCount}</Text>
							</Box>
						</Box>
						{loading[1] !== " Downloading..." && !downloadStatus && !markdownVisible.visible && (
							<Box flexDirection='column'>
								<Text>{'\n'}</Text>
								<Text color="yellow">
									{choice && choice.collected.metadata.description}
								</Text>
								<Text>{'\n'}</Text>
							</Box>
						)}
						{
							markdownVisible.visible &&
							(<Box flexDirection='column'>
								<Text>{'\n'}</Text>
								<Markdown>{choice && markdownVisible.sections[markdownVisible.pointer]}</Markdown>
								<Text>{'\n'}</Text>
								</Box>)
						}
					</>
				) : searchResult.active ? (
					<Box flexDirection="column">
						<Text>Choose a package </Text>
						<Text>| ↑ Selection ↓ or choose by number | → page ← |</Text>
					</Box>
				) : errorState ? (
					<Box flexDirection="column">
						<Text>ERROR</Text>
					</Box>
				) : (
					<Text />
					// <Box flexDirection="column">
					// 	<Newline />
					// 	<Text>Enter an NPM package below...</Text>
					// 	<Newline />
					// </Box>
				)}
				{!loading[0] && !searchResult.active && !choice && (
					<Box flexDirection="column">
						<Newline />
						<Text>Enter an NPM package below...</Text>
						<Newline />
					</Box>
				)}
				{loading[0] && (
					<Box flexDirection='column'>
						<Text>{'\n'}</Text>
						<Text>
							<Text color="green">
								<Spinner type="aesthetic" />
							</Text>
							{loading[1]}
						</Text>
						<Text>{'\n'}</Text>
					</Box>
				)}
				{downloadStatus && (
					<Box flexDirection="column">
						<Text>{'\n'}</Text>
						<Text color="green">Complete. Press any key to continue.</Text>
						<Text>{downloadStatus}</Text>
						<Text>{'\n'}</Text>
					</Box>
				)}
			</Box>
			{choice && !searchResult.active && (
				<Box>
					<Box borderStyle="round" borderColor="blue">
						<Text color={mainOption === 1 ? "red" : "blue"}>1. Back</Text>
					</Box>
					<Box borderStyle="round" borderColor="blue">
						<Text color={mainOption === 2 ? "red" : "blue"}>2. Download</Text>
					</Box>
					<Box borderStyle="round" borderColor="blue">
						<Text color={mainOption === 3 ? "red" : "blue"}>
							3. Return to Search
						</Text>
					</Box>
					<Box borderStyle="round" borderColor="blue">
						<Text color={mainOption === 4 ? "red" : "blue"}>
							4. Toggle Markdown
						</Text>
					</Box>
				</Box>
			)}
			{searchResult.active &&
				searchResult.packages
					.slice(searchPage === 1 ? 0 : (searchPage - 1) * 5, searchPage * 5)
					.map((i: any, index: number) => (
						<Box key={i.package.name} borderStyle="round" borderColor="blue">
							<Text color={searchOption === index + 1 ? "red" : "blue"}>
								{index + 1 + " " + i.package.name}
							</Text>
						</Box>
					))}
			{!choice && !searchResult.active && (
				<Box borderStyle="doubleSingle" borderColor="red">
					<Text>Search🔎:</Text>
					<TextInput
						value={query}
						onChange={setQuery}
						onSubmit={submitHandler}
					/>
				</Box>
			)}
			<Box>
				{searchResult.active && (
					<>
					<Box alignSelf="flex-start" marginLeft={1}>
						<Text dimColor inverse backgroundColor="white" color="blue">
							{` Page ${searchPage} / ${searchResult.packages.length / 5} `}
						</Text>
					</Box>
					<Box marginLeft={1}>
						<Text dimColor inverse backgroundColor="white" color="red">
						{" " + "backspace - search" + " "}
					</Text>
					</Box>
					</>
				)}
				<Spacer />
				<Box alignSelf="flex-end" marginRight={1}>
					<Text dimColor inverse backgroundColor="white" color="red">
						{" " + "esc - exit" + " "}
					</Text>
				</Box>
			</Box>
		</>
	);
};
//module.exports = App;
export default App;
