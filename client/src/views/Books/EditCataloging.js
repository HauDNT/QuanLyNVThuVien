import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../constance.js";
import { toast } from "react-toastify";
import { formatAndDisplayDatetime } from "../../utils/FormatDateTime.js";
import { UserRoleContext } from "../../context/UserRoleContext.js";
import "../../styles/CreateCataloging.scss";

function EditCataloging() {
  const { id } = useParams(); // Id của sách
  const [statusLoadName, setStatusLoadName] = useState(false); // Ngăn khi sửa đổi các input thì fullname không bị load lại liên tục
  const [fullname, setFullname] = useState(""); // Load lên fullname người tạo biên mục
  const [infoCataloging, setInfoCataloging] = useState([]); // Lấy thông tin biên mục
  const [isNotAccept, setIsNotAccept] = useState(0); // Kiểm soát xem biên mục hiện tại có bao nhiêu phân phối chưa được duyệt.
  const idRole = useContext(UserRoleContext).role.RoleId;

  useEffect(() => {
    try {
      axios
        .get(`http://${config.URL}/books/getInfoCatalog/${id}`)
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.error);
            return;
          }

          setInfoCataloging(res.data);
          setStatusLoadName(true);
        });
    } catch (error) {
      toast.error("Đã xảy ra lỗi tại máy chủ! Hãy thử lại sau ít phút...");
    }
  }, []);

  useEffect(() => {
    if (infoCataloging && infoCataloging.UserId && statusLoadName) {
      axios
        .get(`http://${config.URL}/users/fullname/${infoCataloging.UserId}`)
        .then((res) => {
          setFullname(res.data);
        });
    }
  }, [statusLoadName]);

  // Khi Component vừa mới tạo nó sẽ không bắt kịp giá trị fullname nên ta phải dùng
  // useEffect để set lại khi statusLoadName có thay đổi (tức đã load xong)

  useEffect(() => {
    try {
      axios
        .get(`http://${config.URL}/approve/isnotaccept/${id}`)
        .then((res) => {
          setIsNotAccept(res.data);
        });
    } catch (error) {
      toast.error("Số lượng phân mục chưa xác định được!");
    }
  }, []);

  // Hàm update thông tin mới vào biên mục
  const handleUpdateCataloging = () => {
    // Send info to Server:
    axios
      .put(
        `http://${config.URL}/books/updateCataloging/${id}`,
        infoCataloging,
        { headers: { authenToken: localStorage.getItem("authenToken") } },
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          toast.success(res.data.success);
        }
      })
      .catch((error) => toast.error("Đã xảy ra lỗi khi cập nhật thông tin!"));
  };

  // Hàm xóa biên mục:
  const handleDeleteCataloging = () => {
    axios
      .delete(
        `http://${config.URL}/books/deleteCataloging/${id}`,
        infoCataloging,
        { headers: { authenToken: localStorage.getItem("authenToken") } },
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          toast.success(res.data.success);
          window.history.back();
        }
      })
      .catch((error) => toast.error("Đã xảy ra lỗi khi xóa biên mục!"));
  };

  // Hàm phê duyệt biên mục:
  const approveCatalogItem = () => {
    try {
      axios.patch(`http://${config.URL}/approve/accept/${id}`).then((res) => {
        if (res.data.success) {
          toast.success(res.data.success);
          setIsNotAccept(0);
        } else toast.error(res.data.error);
      });
    } catch (error) {
      toast.error("Không thể duyệt biên mục!");
    }
  };

  return (
    <>
      <div className="createCataloging-container">
        <h3 className="col-12 createCataloging-heading">Biên mục</h3>
        <form className="row createCataloging-form">
          <label>Mã sách</label>
          <div class="input-group">
            <span class="input-group-text">ISBN</span>
            <input
              name="ISBN"
              id=""
              value={infoCataloging.ISBN}
              onChange={(e) =>
                setInfoCataloging({ ...infoCataloging, ISBN: e.target.value })
              }
              type="number"
              className="form-control"
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Chỉ số phân loại (DDC)</span>
            <input
              name="DDC"
              id=""
              value={infoCataloging.DDC}
              onChange={(e) =>
                setInfoCataloging({ ...infoCataloging, DDC: e.target.value })
              }
              type="number"
              className="form-control"
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Chỉ số ấn phẩm</span>
            <input
              name="EncryptName"
              id=""
              value={infoCataloging.EncryptName}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  EncryptName: e.target.value,
                })
              }
              type="text"
              className="form-control"
              placeholder="Tên mã hóa của nhan đề chính"
              required
            />
          </div>
          <label>Thông tin sách</label>
          <div class="input-group">
            <span class="input-group-text">Nhan đề chính</span>
            <input
              name="MainTitle"
              id=""
              value={infoCataloging.MainTitle}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  MainTitle: e.target.value,
                })
              }
              type="text"
              className="form-control"
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Nhan đề phụ</span>
            <input
              name="SubTitle"
              id=""
              value={infoCataloging.SubTitle}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  SubTitle: e.target.value,
                })
              }
              type="text"
              className="form-control"
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Thể loại</span>
            <input
              name="Types"
              id=""
              value={infoCataloging.Types}
              onChange={(e) =>
                setInfoCataloging({ ...infoCataloging, Types: e.target.value })
              }
              type="text"
              className="form-control"
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Tác giả chính</span>
            <input
              name="Author"
              id=""
              value={infoCataloging.Author}
              onChange={(e) =>
                setInfoCataloging({ ...infoCataloging, Author: e.target.value })
              }
              type="text"
              className="form-control"
              placeholder="Đối với tác phẩm chỉ có duy nhất một tác giả"
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Tác giả khác</span>
            <input
              name="OrtherAuthors"
              id=""
              value={infoCataloging.OrtherAuthors}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  OrtherAuthors: e.target.value,
                })
              }
              type="text"
              className="form-control"
              placeholder="Đối với tác phẩm có hai tác giả trở lên"
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Phụ trách xuất bản</span>
            <input
              name="Editors"
              id=""
              value={infoCataloging.Editors}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  Editors: e.target.value,
                })
              }
              type="text"
              className="form-control"
              placeholder="Dịch, biên tập, in ấn,..."
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Chủ đề</span>
            <input
              name="Topic"
              id=""
              value={infoCataloging.Topic}
              onChange={(e) =>
                setInfoCataloging({ ...infoCataloging, Topic: e.target.value })
              }
              type="text"
              className="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <p class="form-label">Tóm tắt nội dung</p>
            <textarea
              name="Synopsis"
              class="form-control"
              value={infoCataloging.Synopsis}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  Synopsis: e.target.value,
                })
              }
              rows="3"
            />
          </div>
          <label>Thông tin xuất bản</label>
          <div class="input-group">
            <span class="input-group-text">Nhà xuất bản</span>
            <input
              name="Publisher"
              id=""
              value={infoCataloging.Publisher}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  Publisher: e.target.value,
                })
              }
              type="text"
              className="form-control"
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Nơi xuất bản</span>
            <input
              name="PubPlace"
              id=""
              value={infoCataloging.PubPlace}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  PubPlace: e.target.value,
                })
              }
              type="text"
              className="form-control"
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Năm xuất bản</span>
            <input
              name="PubYear"
              id=""
              value={infoCataloging.PubYear}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  PubYear: e.target.value,
                })
              }
              type="text"
              className="form-control"
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Số lượng phát hành</span>
            <input
              name="QuantityCopies"
              id=""
              value={infoCataloging.QuantityCopies}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  QuantityCopies: e.target.value,
                })
              }
              type="number"
              className="form-control"
              required
            />
          </div>
          <label>Mô tả vật lý</label>
          <div class="input-group">
            <span class="input-group-text">Khổ / Kích thước</span>
            <input
              name="Size"
              id=""
              value={infoCataloging.Size}
              onChange={(e) =>
                setInfoCataloging({ ...infoCataloging, Size: e.target.value })
              }
              type="text"
              className="form-control"
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Số trang</span>
            <input
              name="NumPages"
              id=""
              value={infoCataloging.NumPages}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  NumPages: e.target.value,
                })
              }
              type="number"
              className="form-control"
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Đơn giá</span>
            <input
              name="UnitPrice"
              id=""
              value={infoCataloging.UnitPrice}
              onChange={(e) =>
                setInfoCataloging({
                  ...infoCataloging,
                  UnitPrice: e.target.value,
                })
              }
              type="number"
              className="form-control"
              required
            />
          </div>
          <label>Thông tin biên mục</label>
          <div class="input-group">
            <span class="input-group-text">Người biên mục</span>
            <input
              name="UserId"
              id=""
              type="text"
              className="form-control"
              placeholder="Load họ tên user vào trường input này"
              value={fullname}
              readOnly
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Thời điểm biên mục</span>
            <input
              name="UserId"
              id=""
              type="text"
              className="form-control"
              placeholder="Load họ tên user vào trường input này"
              value={formatAndDisplayDatetime(infoCataloging.createdAt)}
              readOnly
              required
            />
          </div>
          <div class="input-group">
            <span class="input-group-text">Trạng thái</span>
            <input
              name="UserId"
              id=""
              type="text"
              className="form-control"
              placeholder="Load họ tên user vào trường input này"
              value={
                infoCataloging.BooksRegisInfos &&
                infoCataloging.BooksRegisInfos.length > 1
                  ? infoCataloging.BooksRegisInfos[1].Status === true
                    ? "Đã duyệt"
                    : "Chưa duyệt"
                  : "Chưa duyệt"
              }
              readOnly
              required
            />
          </div>

          <div className="col-12 mt-3 button-container">
            {isNotAccept > 0 && (idRole === 1 || idRole === 2) ? (
              <button
                onClick={(e) => approveCatalogItem(e)}
                type="button"
                className="btn btn--catalog btn-success mb-3"
              >
                Duyệt
              </button>
            ) : (
              ""
            )}

            <button
              onClick={(e) => handleDeleteCataloging()}
              type="button"
              className="btn btn--catalog btn-danger mb-3"
            >
              Xóa
            </button>
            <button
              onClick={(e) => handleUpdateCataloging()}
              type="button"
              className="btn btn--catalog btn-primary mb-3"
            >
              Cập nhật
            </button>
            <Link
              to={`/approve/${id}`}
              className="btn btn--catalog btn-primary mb-3"
            >
              Phân phối
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditCataloging;
