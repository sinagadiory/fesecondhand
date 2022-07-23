import React, { useState, useEffect } from 'react'
import styles from "./style.module.css"
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import { BiCube } from "react-icons/bi"
import { AiOutlineDropbox, AiOutlineHistory } from "react-icons/ai"
import { CgDollar } from "react-icons/cg"
import { BsSuitHeart } from "react-icons/bs"
import { FiPlus } from "react-icons/fi";
import Card from 'react-bootstrap/Card';
import { GrNext } from "react-icons/gr"
import style from "../../page/styles/InfoProduk.module.css"
import secondHand from "../../image/camera.png"

export default function CardSeller() {
    const [user, SetUser] = useState("")
    const navigasi = useNavigate()
    const [products, setProducts] = useState([])
    const [macam, setMacam] = useState([])
    const [hist, setHist] = useState([])
    const [jenis, setJenis] = useState("all")

    const fetchdata = async () => {
        try {
            let response = await axios.get("http://localhost:8000/token", {
                withCredentials: true
            })
            const decoded = jwt_decode(response.data.accessToken)
            response = await fetch(`http://localhost:8000/user/${decoded.id}`)
            const data = await response.json()
            SetUser(data)
            response = await axios.get(`http://localhost:8000/v1/Produk/${decoded.id}`)
            setProducts(response.data);
            console.log(response.data)
        } catch (error) {
            navigasi("/")
        }
    }
    const ada = async () => {
        await fetch(`http://localhost:8000/user/${user.id}`)
    }
    useEffect(() => {
        if (!ada) {
            navigasi('/')
            return
        }
        else {
            fetchdata()
        }
    }, []);

    const formatRupiah = (money) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(money);
    };

    const pilih = async (ket) => {
        console.log("liat ket", ket)
        const response = await axios.get(`http://localhost:8000/v1/Produk/${user.id}/${ket}`)
        console.log("coba fungsi", response.data)
        setMacam(response.data)
        setJenis(ket)
    }

    const history = async (ket) => {
        console.log("tes masuk hist")
        const response = await axios.get(`http://localhost:8000/api/v1/penjualan`)
        console.log("coba fungsi", response.data)
        setHist(response.data)
        setJenis(ket)
    }
    console.log("tes hist", hist)
    return (
        <>
            <div className='container'>
                <h4 className='mt-3'>Daftar Jual Saya</h4>
                <div className='row p-3'>
                    <div className={styles.user}>
                        {user.image == null ? <img src={secondHand} className="rounded-circle mx-2" width="60px" height="60px" alt="userimage" /> : <img src={user.image} className="rounded-circle mx-2" width="60px" height="60px" alt="userimage" />}
                        <strong>{user.nama}</strong>
                        <Link to={"/infoprofil"} className='btn mt-2' style={{ borderColor: "#7126B5", borderRadius: "12px", float: "right" }}>edit</Link>
                    </div>
                </div>
                <div className='row p-2 g-3'>
                    <div className='col-lg-4'>
                        <div className={styles.kiri}>
                            <h5 className='mb-4'>Kategori</h5>
                            <a className={styles.hover} onClick={() => setJenis("all")}><BiCube style={{ height: "23px", width: "23px" }} /> Semua Produk <GrNext style={{ float: "right" }} /></a><hr />
                            <a className={styles.hover} onClick={() => setJenis("disukai")}><BsSuitHeart style={{ height: "23px", width: "23px" }} /> Diminati <GrNext style={{ float: "right" }} /> </a><hr />
                            <a className={styles.hover} onClick={() => pilih("sold")}><CgDollar style={{ height: "23px", width: "23px" }} /> Terjual <GrNext style={{ float: "right" }} /></a><hr />
                            <a className={styles.hover} onClick={() => pilih("disabled")}><AiOutlineDropbox style={{ height: "23px", width: "23px" }} /> Habis <GrNext style={{ float: "right" }} /></a><hr />
                            <a className={styles.hover} onClick={() => history("riwayat")}><AiOutlineHistory style={{ height: "23px", width: "23px" }} /> History Penjualan <GrNext style={{ float: "right" }} /></a>
                        </div>
                    </div>
                    <div className='col-lg-8 mb-5'>
                        <div className={styles.kiri}>
                            <div className="row" >
                                {jenis == "all" ?
                                    <>
                                        {products.length != 0 ? products.map((product, index) => (
                                            <div key={index} className="col-lg-4 col-sm-6 col-6 col-md-6 mt-2">
                                                <Card style={{ cursor: "pointer" }} onClick={() => navigasi(`/preview/produk/${product.id}`)} key={product.id}>
                                                    <Card.Img variant="top" src={product.foto} style={{ width: "100%", height: "150px" }} alt="jam" />
                                                    <Card.Body>
                                                        <Card.Title>{product.nama_produk}</Card.Title>
                                                        <Card.Text>
                                                            <small>{product.Kategori.macam}</small><br />
                                                            <strong>{formatRupiah(product.harga)}</strong>
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        )) : <div>
                                            <h3 className='text-center py-4'>Daftar Jual Kosong</h3>
                                            <div className='col-lg-4'><button onClick={() => navigasi("/infoproduk")} style={{ textAlign: "center" }} className={style.fotoProduk}><FiPlus className={style["plus-icon"]} />Tambah Produk
                                            </button></div>
                                        </div>}
                                    </>
                                    : jenis == "disukai" ?
                                        <>
                                            {products.length !== 0 ?
                                                products.map((product, index) => (
                                                    <>
                                                        {product.disukai >= 1 ?
                                                            <div key={index} className="col-lg-4 col-sm-6 col-6 col-md-6 mt-2">
                                                                <Card style={{ cursor: "pointer" }} onClick={() => navigasi(`/preview/produk/${product.id}`)} key={product.id}>
                                                                    <Card.Img variant="top" src={product.foto} style={{ width: "100%", height: "150px" }} alt="jam" />
                                                                    <Card.Body>
                                                                        <Card.Title>{product.nama_produk}</Card.Title>
                                                                        <Card.Text>
                                                                            <small>{product.Kategori.macam}</small><br />
                                                                            <small>Disukai {product.disukai} Pengguna</small><br />
                                                                            <p>Sisa stok : {product.stok}</p>
                                                                            <strong>{formatRupiah(product.harga)}</strong>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>


                                                            </div>
                                                            :
                                                            <></>
                                                        }
                                                    </>
                                                ))

                                                :

                                                <div>
                                                    <h3 className='text-center py-4'>Belum ada produk yang diminati</h3>
                                                </div>}
                                        </>
                                        : jenis == "sold" ?
                                            <>
                                                {macam.length != 0 ? macam.map((product, index) => (
                                                    <div key={index} className="col-lg-4 col-sm-6 col-6 col-md-6 mt-2">
                                                        <Card style={{ cursor: "pointer" }} onClick={() => navigasi(`/preview/produk/${product.id}`)} key={product.id}>
                                                            <Card.Img variant="top" src={product.foto} style={{ width: "100%", height: "150px" }} alt="jam" />
                                                            <Card.Body>
                                                                <Card.Title>{product.nama_produk}</Card.Title>
                                                                <small>{product.Kategori.macam}</small>
                                                                <Card.Text>
                                                                    <p>Terjual : {product.produkTerjual} <br /> Sisa stok : {product.stok}</p>

                                                                    <strong>{formatRupiah(product.harga)}</strong>
                                                                </Card.Text>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                )) : <div>
                                                    <h3 className='text-center py-4'>Daftar Produk Terjual Kosong</h3>
                                                </div>}
                                            </>
                                            : jenis == "disabled" ?
                                                <>
                                                    {macam.length != 0 ? macam.map((product, index) => (
                                                        <div key={index} className="col-lg-4 col-sm-6 col-6 col-md-6 mt-2">
                                                            <Card disabled style={{ cursor: "pointer" }} onClick={() => navigasi(`/preview/produk/${product.id}`)} key={product.id}>
                                                                <Card.Img variant="top" src={product.foto} style={{ width: "100%", height: "150px" }} alt="jam" />
                                                                <Card.Body>
                                                                    <Card.Title>{product.nama_produk}</Card.Title>
                                                                    <Card.Text>
                                                                        <p>Terjual : {product.produkTerjual} <br /> Sisa stok : {product.stok}</p>
                                                                        <small>{product.Kategori.macam}</small><br />
                                                                        <strong>{formatRupiah(product.harga)}</strong>
                                                                    </Card.Text>
                                                                </Card.Body>
                                                            </Card>
                                                        </div>
                                                    )) : <div>
                                                        <h3 className='text-center py-4'>Daftar Produk Habis Kosong</h3>
                                                    </div>}
                                                </>
                                                : jenis == "riwayat" ?
                                                    <>
                                                        {hist.length != 0 ? hist.map((product, index) => (
                                                            <div key={index} className="col-12 mt-2">
                                                                <div className={style.atas}>
                                                                    <div className='row'>
                                                                        <div className='col-3'>
                                                                            <div>
                                                                                <img src={product.User.image} className="rounded-circle mx-2" width="60px" height="60px" alt="userimage" />
                                                                            </div>
                                                                            <div>
                                                                                <strong>{product.User.nama} (Pembeli)</strong><br />
                                                                                <p>{product.User.kota}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-9'>
                                                                            <div className={style.kanan} style={{ display: "flex" }}>
                                                                                <div>
                                                                                    <img src={product.Product.foto} className="rounded mx-1 my-1" width="150px" height="150px" alt="userimage" />
                                                                                </div>
                                                                                <div>
                                                                                    <small>{product.Penawaran.Status.stat}</small><br />
                                                                                    <strong>{product.Product.nama_produk}</strong>
                                                                                    <small>(Kategori {product.Product.Kategori.macam})</small>
                                                                                    <p>{product.Penawaran.jumlah} pcs</p>
                                                                                    <p>Harga deal : {formatRupiah(product.Penawaran.penawaranHarga)}</p>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* <Card style={{ cursor: "pointer" }} onClick={() => navigasi(`/preview/produk/${product.id}`)} key={product.id}>
                                            <Card.Img variant="top" src={product.foto} style={{ width: "100%", height: "150px" }} alt="jam" />
                                            <Card.Body>
                                                <Card.Title>{product.nama_produk}</Card.Title>
                                                <Card.Text>
                                                    <small>{product.Kategori.macam}</small><br />
                                                    <strong>{formatRupiah(product.harga)}</strong>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card> */}
                                                                <hr />
                                                            </div>
                                                        )) : <div>
                                                            <h3 className='text-center py-4'>Daftar Produk Habis Kosong</h3>
                                                        </div>}
                                                    </>
                                                    :
                                                    <div>
                                                        <h3 className='text-center py-4'>Data Kosong</h3>
                                                    </div>
                                }

                                {/* <div className='col-lg-4 col-sm-12 col-md-6 mt-2'><button onClick={() => navigasi("/infoproduk")} style={{ textAlign: "center" }} className={style.fotoProduk}><FiPlus className={style["plus-icon"]} />Tambah Produk
                                </button></div>
                                <div className='col-lg-4 col-sm-12 col-md-6 mt-2'>
                                    <Card>
                                        <button onClick={() => navigasi("/infoproduk")} style={{ textAlign: "center" }} className={style.fotoProduk}><FiPlus className={style["plus-icon"]} />Tambah Produk
                                        </button>
                                    </Card>
                                </div> */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
