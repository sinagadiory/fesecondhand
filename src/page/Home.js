import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode"
import { BsListUl, BsPerson } from 'react-icons/bs';
import moment from "moment";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdNotificationsOutline } from "react-icons/io"
import Card from '../components/card/Card';
import Carousel from '../components/carousel';
import secondHand from "../image/camera.png"
axios.defaults.withCredentials = true;

export default function Home() {
    const [showA, setShowA] = useState(false);
    const [showB, setShowB] = useState(false);
    const [showC, setShowC] = useState(false);
    const [user, SetUser] = useState("")
    const [dijual, setDijual] = useState([])
    const [penawaranmasuk, setPenawaranmasuk] = useState([])
    const [penawarankeluar, setPenawarankeluar] = useState([])
    const [notif, setNotif] = useState([])
    const navigasi = useNavigate()
    const content = <input style={{ borderRadius: "15px", background: '#EEEEEE' }} className="form-control me-2 mx-3" type="search" placeholder="Cari disini.." aria-label="Search"></input>

    const fetchdata = async () => {
        try {
            let response = await axios.get("https://secondhandkel4.herokuapp.com/token", {
                withCredentials: true
            })
            const decoded = jwt_decode(response.data.accessToken)
            response = await fetch(`https://secondhandkel4.herokuapp.com/user/${decoded.id}`)
            const data = await response.json()
            SetUser(data)
            response = await axios.get(`https://secondhandkel4.herokuapp.com/v1/NotifUser/${decoded.id}`)
            setNotif(response.data)
            const dijual = (response.data).filter((dijual) => (dijual.kondisi === "dijual"))
            const penawaranmasuk = (response.data).filter((penawaranmasuk) => (penawaranmasuk.kondisi === "penawaranmasuk"))
            const penawarankeluar = (response.data).filter((penawaranmasuk) => (penawaranmasuk.kondisi === "penawarankeluar"))
            setDijual(dijual[0].dijual)
            setPenawaranmasuk(penawaranmasuk[0].penawaranmasuk)
            setPenawarankeluar(penawarankeluar[0].penawarankeluar)
            console.log("dijual", dijual[0].dijual);
            console.log("penawaranmasuk", penawaranmasuk[0].penawaranmasuk);
            console.log("penawarankeluar", penawarankeluar[0].penawarankeluar);
        } catch (error) {
            navigasi("/")
        }
    }

    useEffect(() => {
        fetchdata()
    }, []);

    const contentUser = <div className='flex'>
        {user.image == null ? <img className='rounded-circle' src={secondHand} width="60px" height="65px" /> : <img src={user.image} className="rounded-circle " width="60px" height="65px" alt="imageuser" />}
        <i><strong className='mx-1' style={{ fontSize: "15px" }}>{user.nama}</strong></i>
    </div>

    const formatRupiah = (money) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(money);
    };

    const toggleShowA = () => setShowA(!showA);
    const toggleShowB = () => setShowB(!showB);
    const toggleShowC = () => setShowC(!showC);
    const Logout = async (e) => {
        e.preventDefault()
        await axios.delete("https://secondhandkel4.herokuapp.com/logout", {
            withCredentials: true
        })
        navigasi("/")
    }
    moment.locale();

    const content1 = <div>
        <BsListUl onClick={() => navigasi("/daftarjual")} style={{ width: "45px", height: "22px", cursor: "pointer" }} />
        <IoMdNotificationsOutline className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ width: "45px", height: "22px", cursor: "pointer" }} />
        <BsPerson onClick={() => navigasi("/infoprofil")} style={{ width: "45px", height: "22px", cursor: "pointer" }} />
        <button onClick={Logout} className='btn btn-outline-danger'>Logout</button>
        <div class="dropdown">
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" onClick={toggleShowA} href="#">Dijual</a></li>
                <li><a class="dropdown-item" onClick={toggleShowB} href="#">PenawaranMasuk</a></li>
                <li><a class="dropdown-item" onClick={toggleShowC} href="#">PenawaranKeluar</a></li>
            </ul>
        </div>

    </div >
    return (
        <>
            <Nav contentUser={contentUser} content={content} content1={content1} />
            <Carousel />
            <ToastContainer className="" style={{ marginTop: "97px", marginRight: "155px" }} position="top-end">
                <Toast show={showA} >
                    <button style={{ borderRadius: "15px", float: "right", color: "white" }} onClick={toggleShowA} className='btn btn-close'></button>
                    {dijual.length != 0 ? dijual.map((jual, index) => (
                        <div key={index}>
                            <Link to={"/daftarjual"} style={{ textDecoration: "none", color: "black" }}>
                                <Toast.Header closeButton={false}>
                                    <img width={"50px"}
                                        src={jual.foto}
                                        className="rounded me-2"
                                        alt=""
                                    />
                                    <h6 className="me-auto">{jual.nama_produk}</h6>
                                    <small>{moment(jual.createdAt).format('llll')}</small>
                                </Toast.Header>
                                <Toast.Body>
                                    <span>Harga {formatRupiah(jual.harga)}</span><br />
                                    <strong>Berhasil ditambahkan</strong>
                                </Toast.Body></Link>
                        </div>
                    )) : <Toast.Header closeButton={false}>
                        <img width={"50px"}
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">
                            Belum Ada Produk yg ditambahkan
                        </strong>
                    </Toast.Header>}
                </Toast>
                <Toast show={showB}>
                    <button style={{ borderRadius: "15px", float: "right", color: "white" }} onClick={toggleShowB} className='btn btn-close'></button>
                    {penawaranmasuk.length != 0 ? penawaranmasuk.map((masuk, index) => (
                        <div key={index}>
                            <Link to={"/penawaran"} style={{ textDecoration: "none", color: "black" }}>
                                <Toast.Header closeButton={false}>
                                    <img width={"50px"}
                                        src={masuk.Product.foto}
                                        className="rounded me-2"
                                        alt=""
                                    />
                                    <strong className="me-auto">
                                        {masuk.Product.nama_produk}
                                    </strong>
                                    <small>{moment(masuk.createdAt).format('llll')}</small>
                                </Toast.Header>
                                <Toast.Body>
                                    <b>{(masuk.User.nama)} (Pembeli)</b><br />
                                    <span>{formatRupiah(masuk.Product.harga)}</span><br />
                                    <span>Ditawar {formatRupiah(masuk.penawaranHarga)}</span><br />
                                    <strong style={{ textAlign: "center" }}>{masuk.Status.stat}</strong>
                                </Toast.Body>
                            </Link>
                        </div>
                    )) : <Toast.Header closeButton={false}>
                        <img width={"50px"}
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">
                            Belum Ada Penawaran Masuk
                        </strong>
                    </Toast.Header>}
                </Toast>
                <Toast show={showC}>
                    <button style={{ borderRadius: "15px", float: "right", color: "white" }} onClick={toggleShowC} className='btn btn-close'></button>
                    {penawarankeluar.length != 0 ? penawarankeluar.map((keluar, index) => (
                        <div key={index}>
                            <Link to={"/penawaran"} style={{ textDecoration: "none", color: "black" }}>
                                <Toast.Header closeButton={false}>
                                    <img width={"50px"}
                                        src={keluar.Product.foto}
                                        className="rounded me-2"
                                        alt=""
                                    />
                                    <strong className="me-auto">{keluar.Product.nama_produk}</strong>
                                    <small>{moment(keluar.createdAt).format('llll')}</small>
                                </Toast.Header>
                                <Toast.Body>
                                    <b>{keluar.Product.User.nama} (Penjual)</b><br />
                                    <span>{formatRupiah(keluar.Product.harga)}</span><br />
                                    <span>Ditawar {formatRupiah(keluar.penawaranHarga)}</span><br />
                                    <strong style={{ textAlign: "center" }}>{keluar.id_status === 1 ? "Berhasil Terbeli" : (keluar.id_status === 4 ? "Ditolak" : keluar.Status.stat)}</strong>
                                </Toast.Body>
                            </Link>
                        </div>
                    )) : <Toast.Header closeButton={false}>
                        <img width={"50px"}
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">
                            Belum Ada Penawaran Keluar
                        </strong>
                    </Toast.Header>}
                </Toast>
            </ToastContainer>
            <div className='container'>
                <Card user={user} />
            </div>
        </>
    )
}
