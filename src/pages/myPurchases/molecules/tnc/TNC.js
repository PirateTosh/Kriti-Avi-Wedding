import React from "react";

const TNC = ({ id, terms }) => (
  <div className="accordion" id={`tnc_${id}`}>
    <div
      className="appGradientColor appBodyFontFamily collapsed"
      data-toggle="collapse"
      href={`#tnc${id}`}
    >
      <p className="font-weight-bold">
        Terms & Conditions <i class="fa fa-caret-down" aria-hidden="true" />
      </p>
    </div>
    <div
      id={`tnc${id}`}
      data-parent={`#tnc_${id}`}
      className="appBodyFontFamily collapse appBodyFontColor"
    >
      <div>
        <ul className="list">{
            !terms ? '' : terms.split(/\n|\r\n|\r/g).map(t => <li className="tnc-list">{t}</li>)
        }
        </ul>
      </div>
    </div>
  </div>
);

export default TNC;
