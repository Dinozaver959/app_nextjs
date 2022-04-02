import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import {SwitchNetwork} from '../JS/local_web3_Moralis';

import Image from 'next/image'
import eth_icon from "../components/images/eth_icon.png";
import bsc_icon from "../components/images/bsc_icon.png";
import polygon_icon from "../components/images/polygon_icon.svg";

class SwitchNetworkButton extends React.Component {
  constructor() {
    super();

    this.state = {
      dropDownValue: "Switch Network"
    }
  }

  changeValue(text) {
    this.setState({dropDownValue: text})
  }

  render() {
    return (

        <div>
            <DropdownButton  title={this.state.dropDownValue} className="format"> 
                <Dropdown.Item as="button"><div onClick={async (e) => await SwitchNetwork("ethereum") && this.changeValue(e.target.textContent)}><Image src={eth_icon} height={20} width={20} alt="" />  ETH</div></Dropdown.Item>
                <Dropdown.Item as="button"><div onClick={async (e) => await SwitchNetwork("polygon") && this.changeValue(e.target.textContent)}><Image src={polygon_icon} height={20} width={20} alt="" />  Polygon</div></Dropdown.Item>
                <Dropdown.Item as="button"><div onClick={async (e) => await SwitchNetwork("bsc") && this.changeValue(e.target.textContent)}><Image src={bsc_icon} height={20} width={20} alt="" />  BSC</div></Dropdown.Item>
            </DropdownButton>
        </div>

    );
  }
}

export default SwitchNetworkButton;



{/**  
    <div className={style.headerIcon}>
        <button type="button" onClick={() => SwitchNetwork("0x1")}>
            ETH
        </button>
    </div>
    <div className={style.headerIcon}>
        <button type="button" onClick={() => SwitchNetwork("0x89")}>
            Polygon
        </button>
    </div>
    <div className={style.headerIcon}>
        <button type="button" onClick={() => SwitchNetwork("0x38")}>
            BSC
        </button>
    </div>
*/}