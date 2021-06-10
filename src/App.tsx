import React, { useEffect, useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import bip32Path from "bip32-path";
import {
  bip39WordsEntropyMap,
  generateMultiSignP2SHAddress,
  hDWalletSegWitBitcoinAddress,
} from "./util/index";
import "./App.css";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import CopyCard from "./components/CopyCard";
import { isPublicKeyInvalid } from "./util/helpers";

function App() {
  const [numberOfEntropy, setNumberOfEntropy] = useState(128);
  const [mnemonicWordsGenerated, setMnemonicWordsGenerated] = useState("");
  const [seedMnemonicWords, setSeedMnemonicWords] = useState(
    "critic question about reason curve body parade index rug august trust humble"
  );
  const [path, setpath] = useState("m/44'/0'/0'/0/0");
  const [generatedBitcoinAddress, setGeneratedBitcoinAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isPathValid, setisPathValid] = useState(true);
  const [enableP2SHAddressBtn, setEnableP2SHAddressBtn] = useState(false);
  const [multSign, setMultiSign] = useState({
    n: 1,
    m: 1,
  });
  const [usersPublicKeys, setUsersPublicKeys] = useState<{
    [key: string]: string;
  }>({});
  const [generatedP2SHBitcoinAddress, setGeneratedP2SHBitcoinAddress] =
    useState("");

  const handleChange = (e: any) => {
    setNumberOfEntropy(parseInt(e.target.value));
  };

  const handleGeneratBtnClick = () => {
    const mnemonicWords = generateMnemonic(numberOfEntropy);
    setMnemonicWordsGenerated(mnemonicWords);
  };

  const handleGenerateBitcoinAddress = () => {
    const seed = mnemonicToSeedSync(seedMnemonicWords, password);
    const address = hDWalletSegWitBitcoinAddress(seed, path);
    setGeneratedBitcoinAddress(address!);
  };

  const handleSeedChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "mnemonic") {
      setSeedMnemonicWords(value.trim());
    } else if (name === "path") {
      const isValid = bip32Path.validateString(value);
      setisPathValid(isValid);
      if (isValid) setpath(value);
    } else {
      setPassword(value);
    }
  };

  const handleMultiSignChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "m" || name === "n") {
      setMultiSign({ ...multSign, [name]: +value });
      if (multSign.n > multSign.m) {
        // reset
        setUsersPublicKeys({});
      }
    } else {
      if (!isPublicKeyInvalid(value)) {
        setUsersPublicKeys({ ...usersPublicKeys, [name]: value });
      } else {
        const copyUserPublicKeys = { ...usersPublicKeys };
        delete copyUserPublicKeys[name];
        setUsersPublicKeys({ ...copyUserPublicKeys });
      }
    }
  };

  const handleGenerateP2SHAddress = () => {
    const pubkeys = Object.values(usersPublicKeys);
    let address = generateMultiSignP2SHAddress(multSign.n, multSign.m, pubkeys);
    setGeneratedP2SHBitcoinAddress(address ?? "");
  };

  const generateSelectDropdown = () => {
    return [...Array(10)].map((_value, index) => (
      <option value={index + 1} key={index + 1}>
        {index + 1}
      </option>
    ));
  };

  useEffect(() => {
    if (Object.values(usersPublicKeys).length === multSign.m) {
      setEnableP2SHAddressBtn(true);
    } else {
      setEnableP2SHAddressBtn(false);
    }
  }, [usersPublicKeys]);

  return (
    <Container>
      <h1 className="d-flex justify-content-center">Bitcoin Playground</h1>
      <Form.Group>
        <legend>Generate a random mnemonic words</legend>
        <Form.Group className="mb-3" controlId="formBasicSelect">
          <Form.Label>Select the number of Mnemonic you want: </Form.Label>
          <Form.Control
            as="select"
            onChange={handleChange}
            data-testid="select-mnemonic"
          >
            {bip39WordsEntropyMap.map((value, index) => (
              <option
                value={value.entropyBit}
                key={index + 1}
                data-testid="select-option"
              >
                {value.noOfWords}
              </option>
            ))}
          </Form.Control>
          <Form.Text className="text-muted">
            The higher the number of words the more secured
          </Form.Text>
        </Form.Group>

        <Button
          data-testid="btn-mnemonic"
          className="mb-3"
          variant="outline-primary"
          onClick={handleGeneratBtnClick}
        >
          Generate
        </Button>
        <CopyCard
          cardText={mnemonicWordsGenerated}
          dataTestid={"generate-mnemonics"}
        />
      </Form.Group>

      <div className="my-3" onChange={handleSeedChange}>
        <legend>
          Generate a Hierarchical Deterministic (HD) Segregated Witness (SegWit)
          Bitcoin Address
        </legend>
        <Form.Group className="mb-3">
          <Form.Label>Enter Seed (mnemonic words): </Form.Label>
          <Form.Control
            type="text"
            name="mnemonic"
            placeholder={
              "critic question about reason curve body parade index rug august trust humble"
            }
            data-testid="segwit-address-seed"
          ></Form.Control>
          <Form.Text className="text-muted">
            must be at least 12 words
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Path</Form.Label>
          <Form.Control
            type="text"
            name="path"
            placeholder={"m/44'/0'/0'/0/0"}
            isInvalid={!isPathValid}
            data-testid="segwit-address-path"
          ></Form.Control>
          <Form.Text className="text-muted">
            must be in the format m/44'/.. default is m/44'/0'/0'/0/0
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Enter Password (optional):</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
          />
        </Form.Group>
        <Button
          data-testid="btn-segwit-address"
          className="mb-3"
          variant="outline-primary"
          onClick={handleGenerateBitcoinAddress}
        >
          Generate Address
        </Button>
        <CopyCard
          cardText={generatedBitcoinAddress}
          dataTestid={"segwit-address-card"}
        />
      </div>
      <div className="pb-5" onChange={handleMultiSignChange}>
        <legend>
          Generate a Multi Signature Pay To Script Bitcoin Address
        </legend>
        <Row>
          <Col sm={12} md={6}>
            <Form.Label>
              Enter minimum number of signatures needed (n)
            </Form.Label>
            <Form.Control as="select" name="n">
              {generateSelectDropdown()}
            </Form.Control>
          </Col>
          <Col sm={12} md={6}>
            <Form.Label>Enter number of public keys (m) </Form.Label>
            <Form.Control as="select" name="m" data-testid="p2sh-address-m">
              {generateSelectDropdown()}
            </Form.Control>
            <Form.Text className="text-muted">
              must be higher or equal to minimum number of signatures (n)
            </Form.Text>
          </Col>
        </Row>
        <Row>
          <Col>
            {multSign.m >= multSign.n && (
              <Form.Group>
                <Form.Label>Enter Public keys</Form.Label>
                <br />
                <Form.Text className="text-muted">
                  All input fields must be filled and must be a valid hex public
                  key, to generate address
                </Form.Text>
                {[...Array(multSign.m)].map((_data, index) => (
                  <Form.Control
                    data-testid="public-key-address-input"
                    className="my-2"
                    type="text"
                    placeholder="Enter hex public key"
                    name={"publicKey" + index + 1}
                    key={index + 1}
                  />
                ))}
                <Button
                  variant="outline-primary"
                  className="my-3"
                  onClick={handleGenerateP2SHAddress}
                  data-testid="p2sh-address-btn-generate"
                  disabled={!enableP2SHAddressBtn}
                >
                  Generate Address
                </Button>
              </Form.Group>
            )}
          </Col>
        </Row>
        <Row>
          <CopyCard
            cardText={generatedP2SHBitcoinAddress}
            dataTestid={"p2sh-address-generate-card"}
          />
        </Row>
      </div>
    </Container>
  );
}

export default App;
