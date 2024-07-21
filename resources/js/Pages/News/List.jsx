import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

const ArticleTable = ({ auth }) => {
    const [articles, setArticles] = useState([]);
    const [query, setQuery] = useState("");
    const [sourceFilter, setSourceFilter] = useState("");
    const [dateFromFilter, setFromDateFilter] = useState(null);
    const [dateToFilter, setToDateFilter] = useState(null);
    const [authorFilter, setAuthorFilter] = useState("");
    const [sortColumn, setSortColumn] = useState("publishedAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecord, setTotalRecord] = useState(1);

    const [columns, setColumns] = useState({
        title: true,
        source: true,
        publishedAt: true,
        author: true,
        description: true,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            setTotalPages(0);
            setLoading(true);
            setError(null);

            try {
                const response = await axios.post("/news", {
                    query,
                    source: sourceFilter,
                    from: dateFromFilter ? dateFromFilter.format("YYYY-MM-DD") : "",
                    to: dateToFilter ? dateToFilter.format("YYYY-MM-DD") : "",
                    author: authorFilter,
                    sortColumn,
                    sortOrder,
                    page,
                    pageSize: 10,
                });

                if (response.status === 200) {
                    const data = response.data.data || {};
                    setArticles(data.data || []);
                    setTotalRecord(data.total);
                    setTotalPages(Math.ceil(data.total / 10));
                } else {
                    setError("Failed to fetch articles. Please try again later.");
                    toast.error(response.data.data ? response.data.data.message : "Failed to fetch articles. Please try again later.");
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
                setError("An error occurred while fetching articles.");
                toast.error(error.response ? error.response.data.message : "An error occurred while fetching articles.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [query, sourceFilter, dateFromFilter, dateToFilter, authorFilter, sortColumn, sortOrder, page]);

    const handleSort = (column) => {
        setSortColumn(column);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const handleColumnToggle = (column) => {
        setColumns((prevColumns) => ({
            ...prevColumns,
            [column]: !prevColumns[column],
        }));
    };

    const handleChange = (newValue) => {
        if (newValue.length > 0) {
            setFromDateFilter(newValue[0]);
            setToDateFilter(newValue[1]);
        } else {
            setFromDateFilter(null);
            setToDateFilter(null);
        }
    };

    const resetFilters = () => {
        setQuery("");
        setSourceFilter("");
        setFromDateFilter(null);
        setToDateFilter(null);
        setAuthorFilter("");
        setPage(1);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    News
                </h2>
            }
        >
            <Head title="News" />
            <ToastContainer />

            <div className="container mx-auto p-6 bg-white shadow-md rounded-lg mt-5">
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-0">
                        <label className="block text-sm font-medium mb-1">
                            Filter by Published Date:
                        </label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateRangePicker
                                startText="Start"
                                endText="End"
                                value={[dateFromFilter, dateToFilter]}
                                onChange={handleChange}
                                renderInput={(startProps, endProps) => (
                                    <div className="flex space-x-4">
                                        <TextField {...startProps} />
                                        <TextField {...endProps} />
                                    </div>
                                )}
                            />
                        </LocalizationProvider>
                    </div>

                    <div className="flex-1 min-w-0">
                        <label className="block text-sm font-medium mb-1">
                            Filter by Source:
                        </label>
                        <input
                            type="text"
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg w-full"
                            placeholder="Source..."
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <label className="block text-sm font-medium mb-1">
                            Filter by Author:
                        </label>
                        <input
                            type="text"
                            value={authorFilter}
                            onChange={(e) => setAuthorFilter(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg w-full"
                            placeholder="Author..."
                        />
                    </div>

                    <div className="flex-1 min-w-0 flex items-end">
                        <button
                            onClick={resetFilters}
                            className="p-3 bg-blue-500 text-white rounded-lg"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="font-semibold text-lg text-gray-800">Toggle Columns</h3>
                    <div className="flex flex-wrap gap-4">
                        {Object.keys(columns).map((column) => (
                            <div key={column} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={columns[column]}
                                    onChange={() => handleColumnToggle(column)}
                                    id={column}
                                    className="mr-2"
                                />
                                <label htmlFor={column} className="text-sm font-medium">
                                    {column.charAt(0).toUpperCase() + column.slice(1)}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200 mb-6">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.title && (
                                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("title")}>
                                    Title {sortColumn === "title" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                            )}
                            {columns.source && (
                                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("source")}>
                                    Source {sortColumn === "source" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                            )}
                            {columns.publishedAt && (
                                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("publishedAt")}>
                                    Published At {sortColumn === "publishedAt" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                            )}
                            {columns.author && (
                                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("author")}>
                                    Author {sortColumn === "author" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                            )}
                            {columns.description && (
                                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("description")}>
                                    Description {sortColumn === "description" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={Object.keys(columns).length} className="p-3 text-center">
                                    <p className="text-blue-600">Loading...</p>
                                </td>
                            </tr>
                        ) : articles.length > 0 ? (
                            articles.map((article, index) => (
                                <tr key={index}>
                                    {columns.title && <td className="p-3">{article.title}</td>}
                                    {columns.source && <td className="p-3">{article.source?.name || "N/A"}</td>}
                                    {columns.publishedAt && <td className="p-3">{dayjs(article.publishedAt).format("YYYY-MM-DD")}</td>}
                                    {columns.author && <td className="p-3">{article.author || "N/A"}</td>}
                                    {columns.description && <td className="p-3">{article.description || "N/A"}</td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={Object.keys(columns).length} className="p-3 text-center">
                                    No articles found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    totalRecords={totalRecord}
                    recordsPerPage={10}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default ArticleTable;
