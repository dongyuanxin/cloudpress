import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "./../Icon/";
import { SearchReq } from "./../../requests/search";
import { findParentClass } from "./../../helpers/dom";
import { useRequest } from "@umijs/hooks";

const SearchInput = () => {
    const size = 10;
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [value, setValue] = useState("");
    const [loadContent, setLoadContent] = useState("已加载全部");
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const onClick = (event) => {
            if (findParentClass(event.target, "cp-search-input")) {
                setShowResults(true);
            } else {
                setShowResults(false);
            }
        };
        window.addEventListener("click", onClick);

        return () => {
            window.removeEventListener("click", onClick);
        };
    }, []);

    const searchResult = async (value, page) => {
        if (typeof value !== "string" || value.trim().length <= 0) {
            return;
        }

        let keywords = value.split(" ");
        keywords = keywords.filter((item) => item.trim().length > 0);

        const result = await SearchReq.searchPassages({
            page,
            size,
            keywords,
        });

        if (page * size > result.count) {
            setLoadContent("已加载全部");
        } else {
            setLoadContent("加载更多");
        }
        if (page === 1) {
            setResults(result.passages);
        } else {
            setResults((current) => [...current, ...result.passages]);
        }
        setPage(page);
    };

    const { run: searchResultDebounced } = useRequest(searchResult, {
        debounceInterval: 500,
        manual: false,
    });

    const onChange = (event) => {
        const value = event.target.value;
        setValue(value);
        searchResultDebounced(value, 1);
    };

    return (
        <div className="cp-search-input">
            <Input
                placeholder="输入关键词搜索"
                style={{ borderRadius: "16px" }}
                suffix={<SearchOutlined style={{ cursor: "pointer" }} />}
                onChange={onChange}
                onFocus={() => setShowResults(true)}
            />
            <div
                style={{ display: showResults ? "block" : "none" }}
                className="cp-search-input-items"
            >
                {results.map((result, index) => (
                    <div
                        key={index}
                        className="cp-search-input-item"
                        onClick={() =>
                            window.open(`/${result.psgID}`, "_blank")
                        }
                    >
                        <div className="cp-search-input-item-title">
                            {result.title}
                        </div>
                        <p className="cp-search-input-item-description">
                            {result.content}
                        </p>
                    </div>
                ))}
                <div
                    className="cp-search-input-btn"
                    onClick={() => searchResult(value || "", page + 1)}
                >
                    {loadContent}
                </div>
            </div>
        </div>
    );
};

export default SearchInput;
