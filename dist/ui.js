"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const ink_text_input_1 = __importDefault(require("ink-text-input"));
const axios = require("axios").default;
const pkg_install_1 = require("pkg-install");
const ink_spinner_1 = __importDefault(require("ink-spinner"));
const ink_markdown_1 = __importDefault(require("ink-markdown"));
const App = () => {
    //const [text, _setText] = useState<string[][]>([]);
    const [query, setQuery] = (0, react_1.useState)("");
    const [choice, setChoice] = (0, react_1.useState)();
    const [mainOption, setMainOption] = (0, react_1.useState)(1);
    const [searchResult, setSearchResult] = (0, react_1.useState)({
        active: false,
        packages: [],
    });
    const [searchOption, setSearchOption] = (0, react_1.useState)(1);
    const [searchPage, setSearchPage] = (0, react_1.useState)(1);
    const [loading, setLoading] = (0, react_1.useState)([false, null]);
    const [downloadStatus, setDownloadStatus] = (0, react_1.useState)();
    const [errorState, setErrorState] = (0, react_1.useState)();
    const [markdownVisible, setMarkdownVisible] = (0, react_1.useState)({ visible: false, sections: [], pointer: 0 });
    const { exit } = (0, ink_1.useApp)();
    (0, ink_1.useInput)((input, key) => {
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
        if (key.rightArrow &&
            searchResult.active &&
            searchPage < searchResult.packages.length / 5) {
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
        if (key.downArrow && markdownVisible.visible && markdownVisible.pointer < (markdownVisible.sections.length - 1)) {
            setMarkdownVisible((p) => ({ ...p, pointer: p.pointer + 1 }));
            //console.log(markdownVisible.pointer)
        }
        if (key.upArrow && markdownVisible.visible && markdownVisible.pointer >= 1) {
            setMarkdownVisible((p) => ({ ...p, pointer: p.pointer - 1 }));
            //console.log(markdownVisible.pointer)
        }
        if ((key.return && !searchResult.active && choice && mainOption === 4) ||
            (input === "4" && !searchResult.active && choice)) {
            //console.log(markdownVisible)
            let sections = "readme" in choice.collected.metadata ? choice.collected.metadata.readme.split('\n## ') : ['🤷 No Readme info available...'];
            setMarkdownVisible((p) => ({ ...p, visible: !p.visible, sections: [...sections] }));
        }
        if (key.backspace || key.delete && searchResult.active) {
            console.log(key.backspace);
            console.log(searchResult);
            setSearchResult((p) => ({ ...p, active: false }));
        }
        /////////////////
        if ((key.return && !searchResult.active && choice && mainOption === 3) ||
            (input === "3" && !searchResult.active && choice)) {
            setChoice(undefined);
            setDownloadStatus(undefined);
            setMarkdownVisible({ visible: false, sections: [], pointer: 0 });
        }
        if ((key.return && !searchResult.active && choice && mainOption === 2) ||
            (input === "2" && !searchResult.active && choice)) {
            setMarkdownVisible((p) => ({ ...p, visible: false }));
            setDownloadStatus(undefined);
            dlHandler();
        }
        if ((key.return && !searchResult.active && choice && mainOption === 1) ||
            (input === "1" && !searchResult.active && choice)) {
            setMarkdownVisible({ visible: false, sections: [], pointer: 0 });
            setSearchResult((p) => ({ ...p, active: true }));
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
            setSearchResult((p) => ({ ...p, active: false }));
            setSearchOption(1);
            setSearchPage(1);
            setLoading([true, ' Loading...']);
            axios
                .get(`https://api.npms.io/v2/package/${searchResult.packages[searchOption - 1 + (searchPage - 1) * 5].package.name}`)
                .then(function (response) {
                //console.log(response.data)
                setChoice(response.data);
                setLoading([false, null]);
            });
        }
        if (input === "1" && searchResult.active) {
            setChoice(searchResult.packages[1 - 1 + (searchPage - 1) * 5]);
            setSearchResult((p) => ({ ...p, active: false }));
            setSearchOption(1);
            setSearchPage(1);
        }
        if (input === "2" && searchResult.active) {
            setChoice(searchResult.packages[2 - 1 + (searchPage - 1) * 5]);
            setSearchResult((p) => ({ ...p, active: false }));
            setSearchOption(1);
            setSearchPage(1);
        }
        if (input === "3" && searchResult.active) {
            setChoice(searchResult.packages[3 - 1 + (searchPage - 1) * 5]);
            setSearchResult((p) => ({ ...p, active: false }));
            setSearchOption(1);
            setSearchPage(1);
        }
        if (input === "4" && searchResult.active) {
            setChoice(searchResult.packages[4 - 1 + (searchPage - 1) * 5]);
            setSearchResult((p) => ({ ...p, active: false }));
            setSearchOption(1);
            setSearchPage(1);
        }
        if (input === "5" && searchResult.active) {
            setChoice(searchResult.packages[5 - 1 + (searchPage - 1) * 5]);
            setSearchResult((p) => ({ ...p, active: false }));
            setSearchOption(1);
            setSearchPage(1);
        }
    });
    const submitHandler = () => {
        //console.log("QUERY", query);
        setLoading([true, " Searching..."]);
        axios
            .get(`https://api.npms.io/v2/search?q=${query}`)
            .then(function (response) {
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
            .catch(function (error) {
            // handle error
            console.log("ERROR STATUS!!!", error.response.status);
            setErrorState(error.response.status);
            setChoice(null);
        });
        setQuery("");
    };
    const dlHandler = () => {
        setLoading([true, " Downloading..."]);
        let packageInfo = {};
        packageInfo[choice.collected.metadata.name] = "latest";
        (async () => {
            const { stdout } = await (0, pkg_install_1.install)(packageInfo, {
                dev: true,
                prefer: "npm",
                verbose: true,
            });
            setLoading([false, null]);
            setDownloadStatus(stdout);
        })();
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_1.Box, { alignItems: "center", justifyContent: "center", borderStyle: "bold", borderColor: "red" },
            react_1.default.createElement(ink_1.Text, { backgroundColor: "red", color: "white" }, "*** NPM CLI TOOL ***")),
        react_1.default.createElement(ink_1.Box, { borderStyle: "round", borderColor: "green", flexDirection: "column" },
            choice && !searchResult.active ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ink_1.Box, { flexDirection: 'row' },
                    react_1.default.createElement(ink_1.Text, null, choice && choice.collected.metadata.name + " "),
                    react_1.default.createElement(ink_1.Text, { color: "blue" }, choice && choice.collected.metadata.version),
                    react_1.default.createElement(ink_1.Spacer, null),
                    react_1.default.createElement(ink_1.Box, { paddingRight: 2 },
                        react_1.default.createElement(ink_1.Text, { color: 'green' }, "Github Stats| "),
                        react_1.default.createElement(ink_1.Text, null,
                            "\u2B50 ",
                            choice.collected.github.starsCount),
                        react_1.default.createElement(ink_1.Text, null,
                            "\uD83C\uDF74 ",
                            choice.collected.github.forksCount))),
                loading[1] !== " Downloading..." && !downloadStatus && !markdownVisible.visible && (react_1.default.createElement(ink_1.Box, { flexDirection: 'column' },
                    react_1.default.createElement(ink_1.Text, null, '\n'),
                    react_1.default.createElement(ink_1.Text, { color: "yellow" }, choice && choice.collected.metadata.description),
                    react_1.default.createElement(ink_1.Text, null, '\n'))),
                markdownVisible.visible &&
                    (react_1.default.createElement(ink_1.Box, { flexDirection: 'column' },
                        react_1.default.createElement(ink_1.Text, null, '\n'),
                        react_1.default.createElement(ink_markdown_1.default, null, choice && markdownVisible.sections[markdownVisible.pointer]),
                        react_1.default.createElement(ink_1.Text, null, '\n'))))) : searchResult.active ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null, "Choose a package "),
                react_1.default.createElement(ink_1.Text, null, "| \u2191 Selection \u2193 or choose by number | \u2192 page \u2190 |"))) : errorState ? (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null, "ERROR"))) : (react_1.default.createElement(ink_1.Text, null)
            // <Box flexDirection="column">
            // 	<Newline />
            // 	<Text>Enter an NPM package below...</Text>
            // 	<Newline />
            // </Box>
            ),
            !loading[0] && !searchResult.active && !choice && (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Newline, null),
                react_1.default.createElement(ink_1.Text, null, "Enter an NPM package below..."),
                react_1.default.createElement(ink_1.Newline, null))),
            loading[0] && (react_1.default.createElement(ink_1.Box, { flexDirection: 'column' },
                react_1.default.createElement(ink_1.Text, null, '\n'),
                react_1.default.createElement(ink_1.Text, null,
                    react_1.default.createElement(ink_1.Text, { color: "green" },
                        react_1.default.createElement(ink_spinner_1.default, { type: "aesthetic" })),
                    loading[1]),
                react_1.default.createElement(ink_1.Text, null, '\n'))),
            downloadStatus && (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
                react_1.default.createElement(ink_1.Text, null, '\n'),
                react_1.default.createElement(ink_1.Text, { color: "green" }, "Complete. Press any key to continue."),
                react_1.default.createElement(ink_1.Text, null, downloadStatus),
                react_1.default.createElement(ink_1.Text, null, '\n')))),
        choice && !searchResult.active && (react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Box, { borderStyle: "round", borderColor: "blue" },
                react_1.default.createElement(ink_1.Text, { color: mainOption === 1 ? "red" : "blue" }, "1. Back")),
            react_1.default.createElement(ink_1.Box, { borderStyle: "round", borderColor: "blue" },
                react_1.default.createElement(ink_1.Text, { color: mainOption === 2 ? "red" : "blue" }, "2. Download")),
            react_1.default.createElement(ink_1.Box, { borderStyle: "round", borderColor: "blue" },
                react_1.default.createElement(ink_1.Text, { color: mainOption === 3 ? "red" : "blue" }, "3. Return to Search")),
            react_1.default.createElement(ink_1.Box, { borderStyle: "round", borderColor: "blue" },
                react_1.default.createElement(ink_1.Text, { color: mainOption === 4 ? "red" : "blue" }, "4. Toggle Markdown")))),
        searchResult.active &&
            searchResult.packages
                .slice(searchPage === 1 ? 0 : (searchPage - 1) * 5, searchPage * 5)
                .map((i, index) => (react_1.default.createElement(ink_1.Box, { key: i.package.name, borderStyle: "round", borderColor: "blue" },
                react_1.default.createElement(ink_1.Text, { color: searchOption === index + 1 ? "red" : "blue" }, index + 1 + " " + i.package.name)))),
        !choice && !searchResult.active && (react_1.default.createElement(ink_1.Box, { borderStyle: "doubleSingle", borderColor: "red" },
            react_1.default.createElement(ink_1.Text, null, "Search\uD83D\uDD0E:"),
            react_1.default.createElement(ink_text_input_1.default, { value: query, onChange: setQuery, onSubmit: submitHandler }))),
        react_1.default.createElement(ink_1.Box, null,
            searchResult.active && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ink_1.Box, { alignSelf: "flex-start", marginLeft: 1 },
                    react_1.default.createElement(ink_1.Text, { dimColor: true, inverse: true, backgroundColor: "white", color: "blue" }, ` Page ${searchPage} / ${searchResult.packages.length / 5} `)),
                react_1.default.createElement(ink_1.Box, { marginLeft: 1 },
                    react_1.default.createElement(ink_1.Text, { dimColor: true, inverse: true, backgroundColor: "white", color: "red" }, " " + "backspace - search" + " ")))),
            react_1.default.createElement(ink_1.Spacer, null),
            react_1.default.createElement(ink_1.Box, { alignSelf: "flex-end", marginRight: 1 },
                react_1.default.createElement(ink_1.Text, { dimColor: true, inverse: true, backgroundColor: "white", color: "red" }, " " + "esc - exit" + " ")))));
};
//module.exports = App;
exports.default = App;
