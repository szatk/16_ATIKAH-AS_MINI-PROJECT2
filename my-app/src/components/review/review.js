import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Button, Input, Collapse, Image, Form } from "antd";
import "./review.css";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import LoadingSvg from "../LoadingSvg";

const { Content } = Layout;

const { Panel } = Collapse;

function ReviewPage(props) {
  const GET_MYSHOES = gql`
    query MyQuery($id: Int!) {
      Produk(where: { id: { _eq: $id } }) {
        gambar
        deskripsi_Produk
        harga
        id
        id_Kategori
        is_ready
        nama
        size1
        size2
        size3
      }
    }
  `;

  const GetMessage = gql`
    query MyQuery {
      Message(limit: 5, order_by: { id: desc }) {
        message
        id
        username
      }
    }
  `;

  const DeleteMessage = gql`
    mutation MyMutation($id: Int!) {
      delete_Message_by_pk(id: $id) {
        id
        message
        username
      }
    }
  `;

  // mutation MyMutation2($id: Int!, $message: String = "") {

  const UpdateMessage = gql`
    mutation MyMutation2($id: Int!, $message: String!) {
      update_Message_by_pk(
        pk_columns: { id: $id }
        _set: { message: $message }
      ) {
        id
        message
        username
      }
    }
  `;

  const InsertMessage = gql`
    mutation MyMutation($object: Message_insert_input!) {
      insert_Message_one(object: $object) {
        id
        message
        username
      }
    }
  `;

  const initialData = {
    //ini buat message
    username: "",
    message: "",
  };

  const [getShoes, { data, loading, error }] = useLazyQuery(GET_MYSHOES);
  // console.log (data)

  const {
    data: dataMessage,
    loading: loadingMessage,
    error: errorMessage,
  } = useQuery(GetMessage);
  // console.log("detail baju props", data);

  const [user, setUser] = useState(initialData);
  const [userStatus, setUserStatus] = useState(false);
  const [userBaru, setUserBaru] = useState("");
  const [messageBaru, setMessageBaru] = useState("");
  const clickUser = () => {
    return setUserStatus(!userStatus);
  };

  const [updateMessage, { loading: loadingUpdate }] = useMutation(
    UpdateMessage,
    {
      refetchQueries: [GetMessage],
    }
  );
  const [deleteMessage, { loading: loadingDelete }] = useMutation(
    DeleteMessage,
    {
      refetchQueries: [GetMessage],
    }
  );
  const [insertMessage, { loading: loadingInsert }] = useMutation(
    InsertMessage,
    {
      refetchQueries: [GetMessage],
    }
  );

  useEffect(() => {
    getShoes({
      variables: { id: props.match.params.id },
    });
    // console.log("saya masuk")
  }, []);

  if (loading || loadingUpdate || loadingDelete || loadingInsert){
    return <LoadingSvg />
   }

  // untuk menjalankan pas submit
  const onSubmitList = (e) => {
    // console.log("masuk submit", e)

    e.preventDefault();
    insertMessage({
      variables: {
        object: {
          username: user.username,
          message: user.message,
        },
      },
    });
    setUser(initialData);
  };

  // untuk masukkan input
  const handleInput = (e) => {
    // console.log("masuk handle input")
    const name = e.target.name;
    const value = e.target.value;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // untuk delete pesan yang sudah kita tulis
  const onDeleteItem = (idx) => {
    //  console.log("idx= detele item", idx.target.value )
    deleteMessage({
      variables: {
        id: idx.target.value,
      },
    });
  };

  const submitMessageBaru = (e, id) => {
    e.preventDefault();
    updateMessage({
      variables: {
        id: id,
        message: messageBaru,
      },
    });
  };

  return (
    <Content style={{ background: "#fff", paddingBottom: 50 }}>
      <div style={{ padding: 20 }}>
        {data?.Produk.map((elementProduk) => (
          <Link
            exact
            to={"/review/" + elementProduk.id}
            className="nav-link"
            activeClassName="my-active"
            aria-current="page"
          >
            <Row gutter={[24, 8]}>
              <Col xs={24} sm={24} md={8} style={{ padding: 10 }}>
                <div style={{ marginBottom: 10 }}>
                  <Link
                    to={"/product/" + elementProduk.id}
                    style={{ color: "#000" }}
                  >
                    DETAIL PRODUCT
                  </Link>{" "}
                  /{" "}
                  <Link
                    to={"/review/" + elementProduk.id}
                    style={{ color: "#000", textDecoration: "underline" }}
                  >
                    REVIEW PRODUCT
                  </Link>
                </div>
                <br/>
                <Image
                  src={elementProduk.gambar}
                  preview={false}
                  style={{ height: 500, marginBottom: 10 }}
                  className="my-shoes2"
                />
              </Col>
              <Col
                xs={24}
                sm={24}
                md={16}
                style={{ padding: 10, marginTop: 30 }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "25pt",
                    color: "#000",
                  }}
                >
                  {elementProduk.nama}
                </div>
                <div style={{ fontSize: "20pt", color: "#000" }}>
                  {elementProduk.harga}
                </div>
                <div style={{ marginTop: 20 }}>
                  <Collapse defaultActiveKey={["1"]} ghost>
                    <Panel
                      header={<Button type="primary">Add Your Review</Button>}
                      showArrow={false}
                      key="1"
                    >
                      <form className="formmessage">
                        <label for="username" className="form-label" style={{fontWeight: "bold", fontSize: "12pt", color: "#000",}}>
                          Username
                        </label>
                        <br/>
                        <input
                          type="text"
                          className="form-control"
                          onChange={handleInput}
                          id="nama"
                          name="username"
                          value={user.username}
                          placeholder="Masukkan Nama"
                        ></input>
                        <br/><br/>

                        <label for="floatingTextarea2" className="form-label" style={{fontWeight: "bold", fontSize: "12pt", color: "#000",}}>
                          Pesan Untukku
                        </label>
                        <br/>
                        <textarea
                          className="form-control"
                          onChange={handleInput}
                          name="message"
                          value={user.message}
                          rows="12"
                          id="floatingTextarea2"
                          placeholder="Masukkan Pesan"
                          style={{ height: "100px" }}
                        ></textarea>
                        <br/>

                        <button
                          type="submit"
                          style={{ background: "#DCAB92" }}
                          className="btn btn-primary"
                          onClick={onSubmitList}
                        >
                          SAVE
                        </button>
                      </form>
                      <br/>

                      {dataMessage?.Message.map((show) => (
                        <li className="komen-list card-kontent mb-4">
                          <div className="">
                            <h5
                              style={{ paddingLeft: "20px" }}
                              className="card-titles ml-4 mt-3"
                            >
                              {show.username}
                            </h5>
                            <p
                              style={{
                                paddingRight: "100px",
                                paddingLeft: "55px",
                              }}
                              className="card-text ml-4 mt-3"
                            >
                              {show.message}
                            </p>
                            <button
                              type="submit"
                              style={{ background: "red", marginRight: 10 }}
                              className="btn"
                              onClick={onDeleteItem}
                              value={show.id}
                              className="del"
                            >
                              Delete
                            </button>
                            <button
                              type="submit"
                              style={{ background: "#FFDAC1" }}
                              className="btn"
                              onClick={clickUser}
                              value={show.id}
                              className="edit"
                            >
                              Edit
                            </button>
                            <form
                              onSubmit={(e) => submitMessageBaru(e, show.id)}
                            >
                              {userStatus ? (
                                <input
                                  onChange={(e) =>
                                    setMessageBaru(e.target.value)
                                  }
                                  placeholder={show.message}
                                />
                              ) : (
                                ""
                              )}
                            </form>
                          </div>
                        </li>
                      ))}
                    </Panel>
                  </Collapse>
                </div>
              </Col>
            </Row>
          </Link>
        ))}
      </div>
    </Content>
  );
}

export default ReviewPage;
