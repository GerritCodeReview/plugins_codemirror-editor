/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {StreamLanguage} from '@codemirror/language';

// Languages
import {asciiArmor} from '@codemirror/legacy-modes/mode/asciiarmor';
import {apl} from '@codemirror/legacy-modes/mode/apl';
import {asn1} from '@codemirror/legacy-modes/mode/asn1';
import {asterisk} from '@codemirror/legacy-modes/mode/asterisk';
import {brainfuck} from '@codemirror/legacy-modes/mode/brainfuck';
import {c} from '@codemirror/legacy-modes/mode/clike';
import {csharp} from '@codemirror/legacy-modes/mode/clike';
import {clojure} from '@codemirror/legacy-modes/mode/clojure';
import {cmake} from '@codemirror/legacy-modes/mode/cmake';
import {cobol} from '@codemirror/legacy-modes/mode/cobol';
import {coffeeScript} from '@codemirror/legacy-modes/mode/coffeescript';
import {commonLisp} from '@codemirror/legacy-modes/mode/commonlisp';
import {crystal} from '@codemirror/legacy-modes/mode/crystal';
import {gss} from '@codemirror/legacy-modes/mode/css';
import {cypher} from '@codemirror/legacy-modes/mode/cypher';
import {d} from '@codemirror/legacy-modes/mode/d';
import {dart} from '@codemirror/legacy-modes/mode/clike';
import {diff} from '@codemirror/legacy-modes/mode/diff';
import {dockerFile} from '@codemirror/legacy-modes/mode/dockerfile';
import {dtd} from '@codemirror/legacy-modes/mode/dtd';
import {dylan} from '@codemirror/legacy-modes/mode/dylan';
import {ebnf} from '@codemirror/legacy-modes/mode/ebnf';
import {ecl} from '@codemirror/legacy-modes/mode/ecl';
import {eiffel} from '@codemirror/legacy-modes/mode/eiffel';
import {elm} from '@codemirror/legacy-modes/mode/elm';
import {erlang} from '@codemirror/legacy-modes/mode/erlang';
import {factor} from '@codemirror/legacy-modes/mode/factor';
import {fcl} from '@codemirror/legacy-modes/mode/fcl';
import {forth} from '@codemirror/legacy-modes/mode/forth';
import {fortran} from '@codemirror/legacy-modes/mode/fortran';
import {gas} from '@codemirror/legacy-modes/mode/gas';
import {gherkin} from '@codemirror/legacy-modes/mode/gherkin';
import {groovy} from '@codemirror/legacy-modes/mode/groovy';
import {fSharp, oCaml} from '@codemirror/legacy-modes/mode/mllike';
import {haskell} from '@codemirror/legacy-modes/mode/haskell';
import {haxe, hxml} from '@codemirror/legacy-modes/mode/haxe';
import {http} from '@codemirror/legacy-modes/mode/http';
import {idl} from '@codemirror/legacy-modes/mode/idl';
import {jinja2} from '@codemirror/legacy-modes/mode/jinja2';
import {jsonld} from '@codemirror/legacy-modes/mode/javascript';
import {julia} from '@codemirror/legacy-modes/mode/julia';
import {kotlin} from '@codemirror/legacy-modes/mode/clike';
import {liveScript} from '@codemirror/legacy-modes/mode/livescript';
import {lua} from '@codemirror/legacy-modes/mode/lua';
import {mathematica} from '@codemirror/legacy-modes/mode/mathematica';
import {mbox} from '@codemirror/legacy-modes/mode/mbox';
import {mirc} from '@codemirror/legacy-modes/mode/mirc';
import {modelica} from '@codemirror/legacy-modes/mode/modelica';
import {mscgen, msgenny} from '@codemirror/legacy-modes/mode/mscgen';
import {mumps} from '@codemirror/legacy-modes/mode/mumps';
import {nginx} from '@codemirror/legacy-modes/mode/nginx';
import {nsis} from '@codemirror/legacy-modes/mode/nsis';
import {ntriples} from '@codemirror/legacy-modes/mode/ntriples';
import {objectiveC} from '@codemirror/legacy-modes/mode/clike';
import {oz} from '@codemirror/legacy-modes/mode/oz';
import {pascal} from '@codemirror/legacy-modes/mode/pascal';
import {perl} from '@codemirror/legacy-modes/mode/perl';
import {pig} from '@codemirror/legacy-modes/mode/pig';
import {powerShell} from '@codemirror/legacy-modes/mode/powershell';
import {properties} from '@codemirror/legacy-modes/mode/properties';
import {protobuf} from '@codemirror/legacy-modes/mode/protobuf';
import {puppet} from '@codemirror/legacy-modes/mode/puppet';
import {q} from '@codemirror/legacy-modes/mode/q';
import {rpmChanges, rpmSpec} from '@codemirror/legacy-modes/mode/rpm';
import {ruby} from '@codemirror/legacy-modes/mode/ruby';
import {sas} from '@codemirror/legacy-modes/mode/sas';
import {scala} from '@codemirror/legacy-modes/mode/clike';
import {scheme} from '@codemirror/legacy-modes/mode/scheme';
import {shader} from '@codemirror/legacy-modes/mode/clike';
import {shell} from '@codemirror/legacy-modes/mode/shell';
import {sieve} from '@codemirror/legacy-modes/mode/sieve';
import {sparql} from '@codemirror/legacy-modes/mode/sparql';
import {spreadsheet} from '@codemirror/legacy-modes/mode/spreadsheet';
import {solr} from '@codemirror/legacy-modes/mode/solr';
import {pgSQL, plSQL, cassandra} from '@codemirror/legacy-modes/mode/sql';
import {squirrel} from '@codemirror/legacy-modes/mode/clike';
import {stex} from '@codemirror/legacy-modes/mode/stex';
import {swift} from '@codemirror/legacy-modes/mode/swift';
import {tcl} from '@codemirror/legacy-modes/mode/tcl';
import {textile} from '@codemirror/legacy-modes/mode/textile';
import {tiddlyWiki} from '@codemirror/legacy-modes/mode/tiddlywiki';
import {tiki} from '@codemirror/legacy-modes/mode/tiki';
import {toml} from '@codemirror/legacy-modes/mode/toml';
import {troff} from '@codemirror/legacy-modes/mode/troff';
import {ttcn} from '@codemirror/legacy-modes/mode/ttcn';
import {ttcnCfg} from '@codemirror/legacy-modes/mode/ttcn-cfg';
import {turtle} from '@codemirror/legacy-modes/mode/turtle';
import {vb} from '@codemirror/legacy-modes/mode/vb';
import {vbScript} from '@codemirror/legacy-modes/mode/vbscript';
import {velocity} from '@codemirror/legacy-modes/mode/velocity';
import {verilog} from '@codemirror/legacy-modes/mode/verilog';
import {vhdl} from '@codemirror/legacy-modes/mode/vhdl';
import {webIDL} from '@codemirror/legacy-modes/mode/webidl';
import {xQuery} from '@codemirror/legacy-modes/mode/xquery';
import {yacas} from '@codemirror/legacy-modes/mode/yacas';
import {z80} from '@codemirror/legacy-modes/mode/z80';

import {cpp} from '@codemirror/lang-cpp';
import {css} from '@codemirror/lang-css';
import {go} from '@codemirror/lang-go';
import {html} from '@codemirror/lang-html';
import {java} from '@codemirror/lang-java';
import {javascript} from '@codemirror/lang-javascript';
import {json} from '@codemirror/lang-json';
import {less} from '@codemirror/lang-less';
import {markdown} from '@codemirror/lang-markdown';
import {php} from '@codemirror/lang-php';
import {python} from '@codemirror/lang-python';
import {rust} from '@codemirror/lang-rust';
import {sass} from '@codemirror/lang-sass';
import {sql} from '@codemirror/lang-sql';
import {vue} from '@codemirror/lang-vue';
import {xml} from '@codemirror/lang-xml';
import {yaml} from '@codemirror/lang-yaml';

export const language = (fileType?: string) => {
  switch (fileType) {
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
      return xml();
    case 'text/css':
      return css();
    case 'text/x-less':
      return less();
    case 'text/x-scss':
      return sass();
    case 'text/x-gss':
      return StreamLanguage.define(gss);
    case 'text/x-cassandra':
      return StreamLanguage.define(cassandra);
    case 'text/x-pgsql':
      return StreamLanguage.define(pgSQL);
    case 'text/x-plsql':
      return StreamLanguage.define(plSQL);
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
      return html();
    case 'application/x-erb':
    case 'text/x-ruby':
      return StreamLanguage.define(ruby);
    case 'text/javascript':
      return javascript();
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
      return go();
    case 'text/x-groovy':
      return StreamLanguage.define(groovy);
    case 'text/x-haskell':
    case 'text/x-literate-haskell':
      return StreamLanguage.define(haskell);
    case 'message/http':
      return StreamLanguage.define(http);
    case 'text/x-haxe':
      return StreamLanguage.define(haxe);
    case 'text/x-hxml':
      return StreamLanguage.define(hxml);
    case 'text/x-jinja2':
      return StreamLanguage.define(jinja2);
    case 'text/x-java':
      return java();
    case 'text/x-julia':
      return StreamLanguage.define(julia);
    case 'application/ld+json':
      return StreamLanguage.define(jsonld);
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
      return StreamLanguage.define(mscgen);
    case 'text/x-msgenny':
      return StreamLanguage.define(msgenny);
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
      return sass({indented: true});
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
    case 'text/vue':
      return StreamLanguage.define(vue);
    case 'text/x-webidl':
      return StreamLanguage.define(webIDL);
    case 'application/xquery':
      return StreamLanguage.define(xQuery);
    case 'text/x-yaml':
      return yaml();
    case 'text/x-yacas':
      return StreamLanguage.define(yacas);
    case 'text/x-z80':
      return StreamLanguage.define(z80);
    case 'text/troff':
      return StreamLanguage.define(troff);
    case 'text/x-sh':
      return StreamLanguage.define(shell);
    case 'text/x-php':
      return php();
    case 'text/x-sql':
      return sql();
  }
  return [];
};
