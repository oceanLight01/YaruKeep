import React from 'react';

/**
 * 改行を含むテキストを受け取りJSXElementに置き換える
 *
 * nullを受け取った時はそのままnullを返す
 *
 * @param {JSX.Element | null} text 改行させたいテキスト
 * @returns {JSX.Element[] | null}
 */
const formatText = (text: string | null) => {
    return text
        ? text.split('\n').map((str, index) => (
              <React.Fragment key={index}>
                  {str}
                  <br />
              </React.Fragment>
          ))
        : null;
};

export default formatText;
