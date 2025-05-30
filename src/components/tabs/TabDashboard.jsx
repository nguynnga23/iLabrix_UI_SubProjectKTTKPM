import { BarChart, LineChart } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import borrowService from "../../services/borrowService";
import categoryService from "../../services/categoryService";
import bookService from "../../services/bookService";

const TabDashboard = () => {
  const OverViewTab = () => {
    const [borrowRequests, setBorrowRequests] = useState();
    const [borrowRequestsToday, setBorrowRequestsToday] = useState();
    const [borrowRequestsYesterday, setBorrowRequestsYesterday] = useState();

    const [booksBorrowedToday, setBooksBorrowedToday] = useState();
    const [booksBorrowedYesterday, setBooksBorrowedYesterday] = useState();

    const [topBooksBorrowed, setTopBooksBorrowed] = useState([]);
    const [numOfColumnTopBooks, setNumOfColumnTopBooks] = useState(3);

    const [booksByCategory, setBooksByCategory] = useState([]);
    const [numOfColumnCategory, setNumOfColumnCategory] = useState(3);

    // Lấy danh sách phiếu mượn
    const fetchBorrowRequests = async () => {
      try {
        const response = await borrowService.getBorrowRequestsStatistics();
        if (!response) {
          throw new Error("Lỗi khi lấy dữ liệu");
        }
        setBorrowRequests(response);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    useEffect(() => {
      fetchBorrowRequests();
    }, []);
    // Dữ liệu cho phân tích các phiếu mượn
    const borrowRequestsData = [
      {
        id: 1,
        value: borrowRequests?.pendingRequests || 0,
        label: "Pending",
      },
      {
        id: 2,
        value: borrowRequests?.approvedRequests || 0,
        label: "Borrowed",
      },
      {
        id: 3,
        value: borrowRequests?.canceledRequests || 0,
        label: "Canceled",
      },
      {
        id: 4,
        value: borrowRequests?.returnedRequests || 0,
        label: "Returned",
      },
      {
        id: 5,
        value: borrowRequests?.overdueRequests || 0,
        label: "Overdue",
      },
    ];

    // Lấy số lượng phiếu mượn ngày hôm nay
    const fetchBorrowRequestsToday = async () => {
      try {
        const response = await borrowService.getBorrowRequestsByDate(
          new Date().toISOString().split("T")[0]
        );
        if (!response) {
          throw new Error("Lỗi khi lấy dữ liệu");
        }
        setBorrowRequestsToday(response);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    useEffect(() => {
      fetchBorrowRequestsToday();
    }, []);

    // Lấy số lượng phiếu mượn ngày hôm qua
    const fetchBorrowRequestsYesterday = async () => {
      try {
        const response = await borrowService.getBorrowRequestsByDate(
          new Date(new Date().setDate(new Date().getDate() - 1))
            .toISOString()
            .split("T")[0]
        );
        if (!response) {
          throw new Error("Lỗi khi lấy dữ liệu");
        }
        setBorrowRequestsYesterday(response);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    useEffect(() => {
      fetchBorrowRequestsYesterday();
    }, []);

    // Lấy số lượng sách được mượn ngày hôm nay
    const fetchBooksBorrowedToday = async () => {
      try {
        const response = await borrowService.getBorrowedBooksByDate(
          new Date().toISOString().split("T")[0]
        );
        if (!response) {
          throw new Error("Lỗi khi lấy dữ liệu");
        }
        setBooksBorrowedToday(response);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    useEffect(() => {
      fetchBooksBorrowedToday();
    }, []);

    // Lấy số lượng sách được mượn ngày hôm qua
    const fetchBooksBorrowedYesterday = async () => {
      try {
        const response = await borrowService.getBorrowedBooksByDate(
          new Date(new Date().setDate(new Date().getDate() - 1))
            .toISOString()
            .split("T")[0]
        );
        if (!response) {
          throw new Error("Lỗi khi lấy dữ liệu");
        }
        setBooksBorrowedYesterday(response);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    useEffect(() => {
      fetchBooksBorrowedYesterday();
    }, []);

    // Lấy danh sách sách được mượn nhiều nhất
    const fetchTopBooksBorrowed = async () => {
      try {
        const response = await bookService.getTopBooksBorrowed();
        if (!response) {
          throw new Error("Lỗi khi lấy dữ liệu");
        }
        setTopBooksBorrowed(response);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    useEffect(() => {
      fetchTopBooksBorrowed();
    }, []);

    // Đếm số lượng sách theo thể loại
    const fetchBooksByCategory = async () => {
      try {
        const response = await categoryService.countBooksByCategory();
        if (!response) {
          throw new Error("Lỗi khi lấy dữ liệu");
        }
        setBooksByCategory(response);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    useEffect(() => {
      fetchBooksByCategory();
    }, []);

    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-2">
        {/* BorrowRecords - Pie Chart */}
        <div className="flex justify-center row-span-1 border-2 border-gray-400 rounded-xl">
          <div>
            <PieChart
              colors={["#F97316", "#3B82F6", "#6B7280", "#10B981", "#DC2626"]}
              series={[
                {
                  data: borrowRequestsData,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  innerRadius: 30,
                },
              ]}
              title="Borrow Requests"
              width={320}
              height={160}
            />
            <div className="text-center">
              Total borrow requests: {borrowRequests?.totalRequests || 0}
            </div>
          </div>
        </div>

        {/* BorrowRecords - Borrowed Today, Returned Yesterday */}
        <div className="flex gap-5 items-center justify-center border-2 border-gray-400 rounded-xl row-span-1">
          <div className="bg-white/75 py-2 px-5 rounded-xl border-2 border-gray-400">
            <div className="text-lg font-medium">Books Borrowed Today</div>
            <div className="flex justify-around mt-2 items-center">
              <div className="text-xl">{booksBorrowedToday}</div>
              <div className="text-sm flex items-center">
                <span
                  className={`${
                    booksBorrowedToday > booksBorrowedYesterday
                      ? "text-green-500"
                      : booksBorrowedToday < booksBorrowedYesterday
                      ? "text-red-500"
                      : "text-gray-500"
                  } font-medium`}
                >
                  {(
                    (booksBorrowedToday / booksBorrowedYesterday) *
                    100
                  ).toFixed(2)}
                  %
                  {booksBorrowedToday !== booksBorrowedYesterday && (
                    <span className="ml-1 inline-flex items-center">
                      {booksBorrowedToday > booksBorrowedYesterday ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 transform transition-transform duration-300 hover:scale-125"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 transform transition-transform duration-300 hover:scale-125"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white/75 py-2 px-5 rounded-xl border-2 border-gray-400">
            <div className="text-lg font-medium">Borrow Requests Today</div>
            <div className="flex justify-around mt-2 items-center">
              <div className="text-xl">{borrowRequestsToday}</div>
              <div className="text-sm flex items-center">
                <span
                  className={`${
                    borrowRequestsToday > borrowRequestsYesterday
                      ? "text-green-500"
                      : borrowRequestsToday < borrowRequestsYesterday
                      ? "text-red-500"
                      : "text-gray-500"
                  } font-medium`}
                >
                  {(
                    (borrowRequestsToday / borrowRequestsYesterday) *
                    100
                  ).toFixed(2)}
                  %
                  {borrowRequestsToday !== borrowRequestsYesterday && (
                    <span className="ml-1 inline-flex items-center">
                      {borrowRequestsToday > borrowRequestsYesterday ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 transform transition-transform duration-300 hover:scale-125"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 transform transition-transform duration-300 hover:scale-125"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Number of Borrwer - Liner Chart */}
        <div className="flex flex-col items-center justify-center row-span-2 border-2 border-gray-400 rounded-xl">
          <div className="flex items-center justify-between ">
            <select
              className="border-2 border-gray-400 rounded-md p-1 m-2"
              defaultValue={3}
              onChange={(e) => setNumOfColumnTopBooks(e.target.value)}
            >
              {[3, 4, 5, 6, 7].map((num) => (
                <option key={num} value={num}>
                  {num} books
                </option>
              ))}
            </select>
          </div>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: topBooksBorrowed
                  .slice(0, numOfColumnTopBooks)
                  .map((item) => item.book.title),
                label: "Book Name",
              },
            ]}
            yAxis={[{ scaleType: "linear" }]}
            series={[
              {
                data: topBooksBorrowed
                  .slice(0, numOfColumnTopBooks)
                  .map((item) => item.count),
              },
            ]}
            width={500}
            height={300}
          />
        </div>

        {/* Number of Book by Category - Liner Chart */}
        <div className="flex flex-col items-center justify-center row-span-2 border-2 border-gray-400 rounded-xl">
          <div className="flex items-center justify-between ">
            <select
              className="border-2 border-gray-400 rounded-md p-1 m-2"
              defaultValue={3}
              onChange={(e) => setNumOfColumnCategory(e.target.value)}
            >
              {[3, 4, 5, 6, 7].map((num) => (
                <option key={num} value={num}>
                  {num} types
                </option>
              ))}
            </select>
          </div>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: booksByCategory
                  .slice(0, numOfColumnCategory)
                  .map((item) => item.categoryName),
                label: "Category Name",
              },
            ]}
            yAxis={[{ scaleType: "linear" }]}
            series={[
              {
                data: booksByCategory
                  .slice(0, numOfColumnCategory)
                  .map((item) => Math.round(item.bookCount)),
              },
            ]}
            width={500}
            height={300}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <OverViewTab />
    </div>
  );
};

export default TabDashboard;
