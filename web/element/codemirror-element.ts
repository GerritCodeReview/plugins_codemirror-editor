/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, css, html} from 'lit';
import {customElement, property, query} from 'lit/decorators';

import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  lineNumbers,
  highlightActiveLineGutter,
  highlightWhitespace,
  highlightTrailingWhitespace,
} from '@codemirror/view';
import {EditorState} from '@codemirror/state';
import {
  defaultHighlightStyle,
  indentOnInput,
  foldGutter,
  foldKeymap,
  bracketMatching,
  syntaxHighlighting,
  indentUnit,
  StreamLanguage,
} from '@codemirror/language';
import {defaultKeymap, history, historyKeymap, indentWithTab} from '@codemirror/commands';
import {searchKeymap, highlightSelectionMatches} from '@codemirror/search';
import {closeBrackets, closeBracketsKeymap} from '@codemirror/autocomplete';

// Languages
import {asciiArmor} from "@codemirror/legacy-modes/mode/asciiarmor";
import {apl} from "@codemirror/legacy-modes/mode/apl";
import {asn1} from "@codemirror/legacy-modes/mode/asn1";
import {asterisk} from "@codemirror/legacy-modes/mode/asterisk";
import {brainfuck} from "@codemirror/legacy-modes/mode/brainfuck";
import {c} from "@codemirror/legacy-modes/mode/clike";
import {csharp} from "@codemirror/legacy-modes/mode/clike";
import {clojure} from "@codemirror/legacy-modes/mode/clojure";
import {cmake} from "@codemirror/legacy-modes/mode/cmake";
import {cobol} from "@codemirror/legacy-modes/mode/cobol";
import {coffeeScript} from "@codemirror/legacy-modes/mode/coffeescript";
import {commonLisp} from "@codemirror/legacy-modes/mode/commonlisp";
import {crystal} from "@codemirror/legacy-modes/mode/crystal";
import {cypher} from "@codemirror/legacy-modes/mode/cypher";
import {d} from "@codemirror/legacy-modes/mode/d";
import {dart} from "@codemirror/legacy-modes/mode/clike";
import {diff} from "@codemirror/legacy-modes/mode/diff";
import {dockerFile} from "@codemirror/legacy-modes/mode/dockerfile";
import {dtd} from "@codemirror/legacy-modes/mode/dtd";
import {dylan} from "@codemirror/legacy-modes/mode/dylan";
import {ebnf} from "@codemirror/legacy-modes/mode/ebnf";
import {ecl} from "@codemirror/legacy-modes/mode/ecl";
import {eiffel} from "@codemirror/legacy-modes/mode/eiffel";
import {elm} from "@codemirror/legacy-modes/mode/elm";
import {erlang} from "@codemirror/legacy-modes/mode/erlang";
import {factor} from "@codemirror/legacy-modes/mode/factor";
import {fcl} from "@codemirror/legacy-modes/mode/fcl";
import {forth} from "@codemirror/legacy-modes/mode/forth";
import {fortran} from "@codemirror/legacy-modes/mode/fortran";
import {gas} from "@codemirror/legacy-modes/mode/gas";
import {go} from "@codemirror/legacy-modes/mode/go";
import {gherkin} from "@codemirror/legacy-modes/mode/gherkin";
import {groovy} from "@codemirror/legacy-modes/mode/groovy";
import {fSharp, oCaml} from "@codemirror/legacy-modes/mode/mllike";
import {haskell} from "@codemirror/legacy-modes/mode/haskell";
import {haxe} from "@codemirror/legacy-modes/mode/haxe";
import {http} from "@codemirror/legacy-modes/mode/http";
import {idl} from "@codemirror/legacy-modes/mode/idl";
import {jinja2} from "@codemirror/legacy-modes/mode/jinja2";
import {julia} from "@codemirror/legacy-modes/mode/julia";
import {kotlin} from "@codemirror/legacy-modes/mode/clike";
import {liveScript} from "@codemirror/legacy-modes/mode/livescript";
import {lua} from "@codemirror/legacy-modes/mode/lua";
import {mathematica} from "@codemirror/legacy-modes/mode/mathematica";
import {mbox} from "@codemirror/legacy-modes/mode/mbox";
import {mirc} from "@codemirror/legacy-modes/mode/mirc";
import {modelica} from "@codemirror/legacy-modes/mode/modelica";
import {mscgen} from "@codemirror/legacy-modes/mode/mscgen";
import {mumps} from "@codemirror/legacy-modes/mode/mumps";
import {nginx} from "@codemirror/legacy-modes/mode/nginx";
import {nsis} from "@codemirror/legacy-modes/mode/nsis";
import {ntriples} from "@codemirror/legacy-modes/mode/ntriples";
import {objectiveC} from "@codemirror/legacy-modes/mode/clike";
import {oz} from "@codemirror/legacy-modes/mode/oz";
import {pascal} from "@codemirror/legacy-modes/mode/pascal";
import {perl} from "@codemirror/legacy-modes/mode/perl";
import {pig} from "@codemirror/legacy-modes/mode/pig";
import {powerShell} from "@codemirror/legacy-modes/mode/powershell";
import {properties} from "@codemirror/legacy-modes/mode/properties";
import {protobuf} from "@codemirror/legacy-modes/mode/protobuf";
import {puppet} from "@codemirror/legacy-modes/mode/puppet";
import {q} from "@codemirror/legacy-modes/mode/q";
import {rpmChanges, rpmSpec} from "@codemirror/legacy-modes/mode/rpm";
import {ruby} from "@codemirror/legacy-modes/mode/ruby";
import {sas} from "@codemirror/legacy-modes/mode/sas";
import {sass} from "@codemirror/legacy-modes/mode/sass";
import {scala} from "@codemirror/legacy-modes/mode/clike";
import {scheme} from "@codemirror/legacy-modes/mode/scheme";
import {shader} from "@codemirror/legacy-modes/mode/clike";
import {shell} from "@codemirror/legacy-modes/mode/shell";
import {sieve} from "@codemirror/legacy-modes/mode/sieve";
import {sparql} from "@codemirror/legacy-modes/mode/sparql";
import {spreadsheet} from "@codemirror/legacy-modes/mode/spreadsheet";
import {solr} from "@codemirror/legacy-modes/mode/solr";
import {squirrel} from "@codemirror/legacy-modes/mode/clike";
import {stex} from "@codemirror/legacy-modes/mode/stex";
import {swift} from "@codemirror/legacy-modes/mode/swift";
import {tcl} from "@codemirror/legacy-modes/mode/tcl";
import {textile} from "@codemirror/legacy-modes/mode/textile";
import {tiddlyWiki} from "@codemirror/legacy-modes/mode/tiddlywiki";
import {tiki} from "@codemirror/legacy-modes/mode/tiki";
import {toml} from "@codemirror/legacy-modes/mode/toml";
import {troff} from "@codemirror/legacy-modes/mode/troff";
import {ttcn} from "@codemirror/legacy-modes/mode/ttcn";
import {ttcnCfg} from "@codemirror/legacy-modes/mode/ttcn-cfg";
import {turtle} from "@codemirror/legacy-modes/mode/turtle";
import {vb} from "@codemirror/legacy-modes/mode/vb";
import {vbScript} from "@codemirror/legacy-modes/mode/vbscript";
import {velocity} from "@codemirror/legacy-modes/mode/velocity";
import {verilog} from "@codemirror/legacy-modes/mode/verilog";
import {vhdl} from "@codemirror/legacy-modes/mode/vhdl";
import {webIDL} from "@codemirror/legacy-modes/mode/webidl";
import {xQuery} from "@codemirror/legacy-modes/mode/xquery";
import {yacas} from "@codemirror/legacy-modes/mode/yacas";
import {yaml} from "@codemirror/legacy-modes/mode/yaml";
import {z80} from "@codemirror/legacy-modes/mode/z80";

import {cpp} from '@codemirror/lang-cpp';
import {css as _css} from '@codemirror/lang-css';
import {java} from '@codemirror/lang-java';
import {html as _html} from '@codemirror/lang-html';
import {javascript} from '@codemirror/lang-javascript';
import {json} from '@codemirror/lang-json';
import {markdown} from '@codemirror/lang-markdown';
import {php} from '@codemirror/lang-php';
import {python} from '@codemirror/lang-python';
import {rust} from '@codemirror/lang-rust';
import {sql} from '@codemirror/lang-sql';
import {xml} from '@codemirror/lang-xml';

type ValueChangedEvent<T = string> = CustomEvent<{value: T}>;

declare global {
  interface HTMLElementEventMap {
    'content-change': ValueChangedEvent;
  }
  interface HTMLElementTagNameMap {
    'codemirror-element': CodeMirrorElement;
  }
}

@customElement('codemirror-element')
export class CodeMirrorElement extends LitElement {
  @property({type: Number}) lineNum?: number;

  @property({type: Object}) params?: any;

  editor!: EditorView;

  @query('#editor')
  _editorEl!: HTMLElement;

  private initialized = false;

  static override get styles() {
    return [
      css`
        .cm-editor {
          font-family: 'Roboto Mono', 'SF Mono', 'Lucida Console', Monaco, monospace;
          /* CodeMirror has a default z-index of 4. Set to 0 to avoid collisions with fixed header. */
          z-index: 0;
          background: white;
        }
        .cm-lineNumbers {
          background-color: #fafafa;
        }
        .cm-line {
          color: #757575;
        }
        .CodeMirror-ruler {
          border-left: 1px solid #ddd;
        }
        .cm-editor .cm-content {
          font-family: 'Roboto Mono', 'SF Mono', 'Lucida Console', Monaco, monospace;
        }
        .cm-scroller { overflow: auto }
      `,
    ];
  }

  override render() {
    return html`<div id="editor"></div>`;
  }

  override updated() {
    this.initialize();
  }

  private initialize() {
    if (!this.params || !this.isConnected || !this._editorEl) return;

    if (this.initialized) return;
    this.initialized = true;

    let updateListenerExtension = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        this.dispatchEvent(
          new CustomEvent('content-change', {
            detail: {value: update.state.doc.toString()},
            bubbles: true,
            composed: true,
          })
        );
      }
    });

    const offsetTop = this.getBoundingClientRect().top;
    const clientHeight = window.innerHeight ?? document.body.clientHeight;
    // We are setting a fixed height, because for large files we want to
    // benefit from CodeMirror's virtual scrolling.
    // 80px is roughly the size of the bottom margins plus the footer height.
    // This ensures the height of the textarea doesn't push out of screen.
    const height = clientHeight - offsetTop - 80;

    const fixedHeightEditor = EditorView.theme({
      "&": {height: `${height}px`},
      ".cm-scroller": {overflow: "auto"},
      ".cm-tab:before": {
        color: '#757575',
        content: "'\\2192'",
        position: 'absolute'
      },
      ".cm-trailingspace": {
        'background-color': '#ef9a9a',
        border: '1px solid #f44336',
        'border-radius': '3px',
      },
      ".cm-highlightTab": {
        'background-image': 'none',
        'background-size': 'none',
        'background-position': 'none',
        'background-repeat': 'none',
        display: 'inline-block',
        'text-decoration': 'inherit',
      },
      ".cm-highlightTab:before": {
        color: '#757575',
        content: "'\\2192'",
        position: 'absolute'
      }
    })
    this.editor = new EditorView({
      state: EditorState.create({
        doc: this.params.value,
        extensions: [
          ...this.getCodeMirrorExtensions(),
          updateListenerExtension,
          fixedHeightEditor,
        ],
      }),
      parent: this._editorEl as Element,
    });

    setTimeout(() => {
      this.editor.focus();

      if (this.lineNum) {
        // We have to take away one from the line number,
        // ... because CodeMirror's line count is zero-based.
        this.editor.dispatch({selection: {anchor: this.lineNum - 1}})
      }
      //this.editor.requestMeasure()
    }, 1);
    this.editor.contentDOM.addEventListener('keydown', e => {
      // Exempt the ctrl/command+s key from preventing events from propagating
      // through the app. This is because we use it to save changes.
      if (!e.metaKey && !e.ctrlKey) {
        e.stopPropagation();
      }
    });
    this.requestUpdate();
  }

  /**
   * Generates an array containing codemirror extensions
   * based on the users preference.
   */
  private getCodeMirrorExtensions() {
    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      highlightWhitespace(),
      highlightTrailingWhitespace(),
      history(),
      foldGutter(),
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        indentWithTab,
      ]),
      // eventPlugin(this),
    ];

    // Have to make sure that this if statement
    // is triggered even when the value is 0.
    if (this.params?.indentUnit >= 0) {
      extensions.push(indentUnit.of(' '.repeat(this.params.indentUnit)));
    }

    if (this.params?.mode) {
      if (this.getLanguageMode()) {
        extensions.push(this.getLanguageMode() as any, syntaxHighlighting(defaultHighlightStyle, {fallback: true}));
      }
    }

    if (this.params?.autoCloseBrackets) {
      extensions.push(closeBrackets())
    }

    if (this.params?.matchBrackets) {
      extensions.push(bracketMatching())
    }

    // Have to make sure that this if statement
    // is triggered even when the value is 0.
    if (this.params?.tabSize >= 0) {
      extensions.push(EditorState.tabSize.of(this.params.tabSize));
    }

    if (this.params.lineSeparator?.includes('\r\n')) {
      extensions.push(EditorState.lineSeparator.of('\r\n'));
    }

    return [...extensions];
  }

  private getLanguageMode() {
    switch (this.params?.mode) {
      case 'text/apl':
      case 'text/apl':
        return StreamLanguage.define(apl);
      case 'text/x-ttcn-asn':
        return StreamLanguage.define(asn1({}));
      case 'text/x-asterisk':
        return StreamLanguage.define(asterisk);
      case 'text/x-brainfuck':
        return StreamLanguage.define(brainfuck);
      case 'text/x-ebnf':
        return StreamLanguage.define(ebnf);
      case 'text/x-python':
        return python();
      case 'text/x-csrc':
        return StreamLanguage.define(c);
      case 'text/x-csharp':
        return StreamLanguage.define(csharp);
      case 'text/x-c++src':
        return cpp();
      case 'application/dart':
        return StreamLanguage.define(dart);
      case 'text/x-kotlin':
        return StreamLanguage.define(kotlin);
      case 'text/x-objectivec':
        return StreamLanguage.define(objectiveC);
      case 'x-shader/x-fragment':
      case 'x-shader/x-vertex':
        return StreamLanguage.define(shader);
      case 'text/x-ttcn-cfg':
        return StreamLanguage.define(ttcnCfg);
      case 'text/x-common-lisp':
        return StreamLanguage.define(commonLisp);
      case 'text/x-clojure':
      case 'text/x-clojurescript':
        return StreamLanguage.define(clojure);
      case 'text/x-cmake':
        return StreamLanguage.define(cmake);
      case 'application/json':
        return json();
      case 'text/x-cobol':
        return StreamLanguage.define(cobol);
      case 'text/x-coffeescript':
        return StreamLanguage.define(coffeeScript);
      case 'text/x-ini':
      case 'text/x-properties':
        return StreamLanguage.define(properties);
      case 'text/x-crystal':
        return StreamLanguage.define(crystal);
      case 'application/xml':
        return xml;
      case 'text/css':
      case 'text/x-gss':
      case 'text/x-less':
      case 'text/x-scss':
        return _css();
      case 'text/x-cassandra':
      case 'text/x-pgsql':
      case 'text/x-plsql':
        return sql();
      case 'application/x-cypher-query':
        return StreamLanguage.define(cypher);
      case 'text/x-d':
        return StreamLanguage.define(d);
      case 'text/x-diff':
        return StreamLanguage.define(diff);
      case 'application/xml-dtd':
        return StreamLanguage.define(dtd);
      case 'text/x-dylan':
        return StreamLanguage.define(dylan);
      case 'text/x-dockerfile':
        return StreamLanguage.define(dockerFile);
      case 'text/x-eiffel':
        return StreamLanguage.define(eiffel);
      case 'text/x-ecl':
        return StreamLanguage.define(ecl);
      case 'text/x-elm':
        return StreamLanguage.define(elm);
      case 'application/x-ejs':
      case 'text/html':
      case 'application/x-jsp':
        return _html();
      case 'application/x-erb':
      case 'text/x-ruby':
        return StreamLanguage.define(ruby);
      case 'text/x-erlang':
        return StreamLanguage.define(erlang);
      case 'text/jsx':
        return javascript({jsx: true});
      case 'text/x-spreadsheet':
        return StreamLanguage.define(spreadsheet);
      case 'text/x-fortran':
        return StreamLanguage.define(fortran);
      case 'text/x-factor':
        return StreamLanguage.define(factor);
      case 'text/x-feature':
      case 'text/x-gherkin':
        return StreamLanguage.define(gherkin);
      case 'text/x-fcl':
        return StreamLanguage.define(fcl);
      case 'text/x-forth':
        return StreamLanguage.define(forth);
      case 'text/x-fsharp':
        return StreamLanguage.define(fSharp);
      case 'text/x-go':
        return StreamLanguage.define(go);
      case 'text/x-groovy':
        return StreamLanguage.define(groovy);
      case 'text/x-haskell':
      case 'text/x-literate-haskell':
        return StreamLanguage.define(haskell);
      case 'message/http':
        return StreamLanguage.define(http);
      case 'text/x-haxe':
      case 'text/x-hxml':
        return StreamLanguage.define(haxe);
      case 'text/x-jinja2':
        return StreamLanguage.define(jinja2);
      case 'text/x-java':
        return java();
      case 'text/x-julia':
        return StreamLanguage.define(julia);
      case 'application/ld+json':
        return javascript();
      case 'text/x-livescript':
        return StreamLanguage.define(liveScript);
      case 'text/x-lua':
        return StreamLanguage.define(lua);
      case 'text/x-markdown':
        return markdown();
      case 'application/mbox':
        return StreamLanguage.define(mbox);
      case 'text/mirc':
        return StreamLanguage.define(mirc);
      case 'text/x-ocaml':
        return StreamLanguage.define(oCaml);
      case 'text/x-modelica':
        return StreamLanguage.define(modelica);
      case 'text/x-mumps':
        return StreamLanguage.define(mumps);
      case 'text/x-mscgen':
      case 'text/x-msgenny':
        return StreamLanguage.define(mscgen);
      case 'text/x-mathematica':
        return StreamLanguage.define(mathematica);
      case 'text/x-nginx-conf':
        return StreamLanguage.define(nginx);
      case 'text/x-nsis':
        return StreamLanguage.define(nsis);
      case 'text/n-triples':
        return StreamLanguage.define(ntriples);
      case 'text/x-squirrel':
        return StreamLanguage.define(squirrel);
      case 'text/x-oz':
        return StreamLanguage.define(oz);
      case 'text/x-pascal':
        return StreamLanguage.define(pascal);
      case 'application/pgp':
        return StreamLanguage.define(asciiArmor);
      case 'text/x-pig':
        return StreamLanguage.define(pig);
      case 'text/x-perl':
        return StreamLanguage.define(perl);
      case 'text/x-puppet':
        return StreamLanguage.define(puppet);
      case 'text/x-idl':
        return StreamLanguage.define(idl);
      case 'text/x-protobuf':
        return StreamLanguage.define(protobuf);
      case 'application/x-powershell':
        return StreamLanguage.define(powerShell);
      case 'text/x-q':
        return StreamLanguage.define(q);
      case 'text/x-rpm-spec':
        return StreamLanguage.define(rpmSpec);
      case 'text/x-rpm-changes':
        return StreamLanguage.define(rpmChanges);
      case 'application/sparql-query':
        return StreamLanguage.define(sparql);
      case 'text/x-rustsrc':
        return rust();
      case 'text/x-gas':
        return StreamLanguage.define(gas);
      case 'text/x-sas':
        return StreamLanguage.define(sas);
      case 'text/x-sass':
        return StreamLanguage.define(sass);
      case 'text/x-scala':
        return StreamLanguage.define(scala);
      case 'text/x-scheme':
        return StreamLanguage.define(scheme);
      case 'application/sieve':
        return StreamLanguage.define(sieve);
      case 'text/x-solr':
        return StreamLanguage.define(solr);
      case 'text/x-stex':
      case 'text/x-latex':
        return StreamLanguage.define(stex);
      case 'text/x-systemverilog':
        return StreamLanguage.define(verilog);
      case 'text/x-swift':
        return StreamLanguage.define(swift);
      case 'text/x-tcl':
        return StreamLanguage.define(tcl);
      case 'text/x-textile':
        return StreamLanguage.define(textile);
      case 'text/x-tiddlywiki':
        return StreamLanguage.define(tiddlyWiki);
      case 'text/tiki':
        return StreamLanguage.define(tiki);
      case 'text/x-toml':
        return StreamLanguage.define(toml);
      case 'text/x-toml':
        return StreamLanguage.define(toml);
      case 'application/typescript':
        return javascript({typescript: true});
      case 'text/x-ttcn':
        return StreamLanguage.define(ttcn);
      case 'text/turtle':
        return StreamLanguage.define(turtle);
      case 'text/x-vb':
        return StreamLanguage.define(vb);
      case 'text/vbscript':
        return StreamLanguage.define(vbScript);
      case 'text/x-vhdl':
        return StreamLanguage.define(vhdl);
      case 'text/velocity':
        return StreamLanguage.define(velocity);
      case 'text/x-webidl':
        return StreamLanguage.define(webIDL);
      case 'application/xquery':
        return StreamLanguage.define(xQuery);
      case 'text/x-yaml':
        return StreamLanguage.define(yaml);
      case 'text/x-yacas':
        return StreamLanguage.define(yacas);
      case 'text/x-z80':
        return StreamLanguage.define(z80);
      case 'text/troff':
        return StreamLanguage.define(troff);
      case 'text/x-sh':
        return StreamLanguage.define(shell);
      case "text/x-php":
        return php();
    }
    return undefined;
  }
}
