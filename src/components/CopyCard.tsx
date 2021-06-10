import React, { useState } from "react";
import { Card } from "react-bootstrap";

interface CardProps {
  cardText: string;
  dataTestid?: string;
}

const CopyCard: React.FC<CardProps> = ({ cardText, dataTestid }) => {
  const [isCopied, setisCopied] = useState(false);

  const handleContentClick = () => {
    // triggers auto copy
    const textField = document.createElement("textarea");
    textField.innerText = cardText;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    // set copy
    setisCopied(true);
    let id = setTimeout(() => {
      setisCopied(false);
      clearTimeout(id);
    }, 2000);
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        {isCopied
          ? "✔ Copied to clipboard"
          : cardText.trim()
          ? "Click on card to copy"
          : ""}
      </div>
      <Card style={{ cursor: "copy" }} onClick={handleContentClick}>
        <Card.Body className="py-5" data-testid={dataTestid}>
          {cardText}
        </Card.Body>
      </Card>
    </>
  );
};

export default CopyCard;
