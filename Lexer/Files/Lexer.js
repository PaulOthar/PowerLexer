//Variable Related

class Variable {
    name;
    value;

    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    //Getters And Setters

    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }

    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
    }

    toString() {
        return `${this.getName()} : ${this.getValue()}`;
    }
}

class VarList {
    variables;

    constructor() {
        this.variables = new Array();
    }

    addRefVariable(variable) {
        this.getVariables().push(variable);
    }

    addVariable(name, value) {
        this.addRefVariable(new Variable(name, value));
    }

    static filterVariables(char, position, variables) {
        let output = new Array();

        for (let i = 0; i < variables.length; i++) {
            if (variables[i].getName()[position] == char) {
                output.push(variables[i]);
            }
        }

        return output;
    }

    DEPRECATED_filterVariables(char, position, sample) {
        for (let i = 0; i < sample.length; i++) {
            if (sample[i].getName()[position] != char) {
                sample.splice(i, 1);
                i--;
            }
        }
    }

    //Getters And Setters

    getVariables() {
        return this.variables;
    }
    setVariables(variables) {
        this.variables = variables;
    }
}

//Token Related

class AbstractToken {
    name;
    type;

    constructor(name, type) {
        this.name = name;
        this.type = type;
    }

    check(input) {
        //Checks if the Whole string is equal to the input
        return 0;//Not Valid
    }
    compare(input, position) {
        //Checks if the string fragment is equal to the input
        return 0;
    }

    //Getters And Setters

    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }

    getType() {
        return this.type;
    }
    setType(type) {
        this.type = type;
    }

    toString() {
        return `${this.getType()} ${this.getName()}`;
    }
}

class Token extends AbstractToken {
    symbol;

    constructor(name, type, symbol) {
        super(name, type);
        this.symbol = symbol;
    }

    //Override
    check(input) {
        if (this.getSymbol() == input) {
            return 1;
        }
        return 0;
    }
    compare(input, position) {
        if (this.getSymbol().length >= position + 1) {
            if (this.getSymbol()[position] == input) {
                return 1;
            }
        }
        return 0;
    }

    //Getters And Setters

    getSymbol() {
        return this.symbol;
    }
    setSymbol(symbol) {
        this.symbol = symbol;
    }

    toString() {
        return `${super.toString()} = ${this.getSymbol()}`;
    }
}

class TokenStructure extends AbstractToken {
    symbols;
    extended;
    isExtended;

    constructor(name, type, symbols) {
        super(name, type);
        this.symbols = symbols;
        this.isExtended = 0;
    }

    //Override
    check(input) {
        let symbolholder = this.getSymbols();

        for (let i = 0; i < symbolholder.length; i++) {
            if (symbolholder[i] == input) {
                return 1;
            }
        }
        return 0;
    }
    compare(input, position) {
        return this.check(input);
    }

    setExtention(extention) {
        this.setExtended(extention);
        this.setIsExtended(1);
    }

    deepcheck(input) {
        if (this.check(input)) {
            return 1;
        }
        if (this.getIsExtended()) {
            if (this.getExtended().deepcheck(input)) {
                return 1;
            }
        }
        return 0;
    }

    //Getters And Setters

    getSymbols() {
        return this.symbols;
    }
    setSymbols(symbols) {
        this.symbols = symbols;
    }

    getExtended() {
        return this.extended;
    }
    setExtended(extended) {
        this.extended = extended;
    }

    getIsExtended() {
        return this.isExtended;
    }
    setIsExtended(isExtended) {
        this.isExtended = isExtended;
    }

    toString() {
        let symbs = new String();

        let symbolholder = this.getSymbols();

        for (let i = 0; i < symbolholder.length; i++) {
            if (i > 0) {
                symbs += ",";
            }
            symbs += `${symbolholder[i]}`;
        }

        return `${super.toString()} = [${symbs}]`;
    }
}

class Lexicon {
    name;
    tokens;
    structures;

    constructor(name) {
        this.name = name;
        this.tokens = new Array();
        this.structures = new Array();
    }

    addToken(name, type, symbol) {
        this.getTokens().push(new Token(name, type, symbol));
    }

    addStructure(name, type, symbols) {
        this.getStructures().push(new TokenStructure(name, type, symbols));
    }

    getStructureByName(name) {
        let structureHolder = this.getStructures()
        for (let i = 0; i < structureHolder.length; i++) {
            if (structureHolder[i].getName() == name) {
                return structureHolder[i];
            }
        }
    }

    addExtendedStructure(name, symbols, extension_name) {
        let extention = this.getStructureByName(extension_name);
        let extstr = new TokenStructure(name, extention.getType(), symbols);
        extstr.setExtention(extention);
        this.getStructures().push(extstr);
    }

    static filterTokens(char, position, tokens) {
        let output = new Array();

        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].compare(char, position)) {
                output.push(tokens[i]);
            }
        }

        return output;
    }

    static filterStructures(char, structures) {
        let output = new Array();

        for (let i = 0; i < structures.length; i++) {
            if (structures[i].deepcheck(char)) {
                output.push(structures[i]);
            }
        }

        return output;
    }

    //Getters And Setters

    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }

    getTokens() {
        return this.tokens;
    }
    setTokens(tokens) {
        this.tokens = tokens;
    }

    getStructures() {
        return this.structures;
    }
    setStructures(structures) {
        this.structures = structures;
    }

    toString() {
        let output = new String();

        let tokensholder = this.getTokens();
        let structuresholder = this.getStructures();

        let types = new Array();
        let content = new Array();

        for (let i = 0, found = -1; i < tokensholder.length; i++, found = -1) {
            for (let l = 0; l < types.length; l++) {
                if (types[l] == tokensholder[i].getType()) {
                    found = l;
                    break;
                }
            }
            if (found == -1) {
                types.push(tokensholder[i].getType());
                content.push(new String());
                found = types.length - 1;
            }
            if (content[found].length > 0) {
                content[found] += "\n";
            }
            content[found] += `${tokensholder[i].toString()}`;
        }
        for (let i = 0, found = -1; i < structuresholder.length; i++, found = -1) {
            for (let l = 0; l < types.length; l++) {
                if (types[l] == structuresholder[i].getType()) {
                    found = l;
                    break;
                }
            }
            if (found == -1) {
                types.push(structuresholder[i].getType());
                content.push(new String());
                found = types.length - 1;
            }
            if (content[found].length > 0) {
                content[found] += "\n";
            }
            content[found] += `${structuresholder[i].toString()}`;
        }

        for (let i = 0; i < content.length; i++) {
            if (i > 0) {
                output += `\n`;
            }
            output += content[i];
        }

        return output;
    }
}

//Lexer Related

class Lexer {
    lexicons;
    usedLexicons;   //Index Array

    unknownStream;
    currentStream;
    previousStream;

    isStructure;
    isToken;
    isVariable;

    wasStructure;
    wasToken;
    wasVariable;

    usedStructures;
    currentStructures;
    previousStructures;

    usedTokens;
    currentTokens;
    previousTokens;

    usedVariables;
    currentVariables;
    previousVariables;

    tokenOutput;

    constructor() {
        this.lexicons = new Array();
        this.usedLexicons = new Array();
        this.usedVariables = new VarList();
        this.tokenOutput = new Array();
    }

    addLexicon(lexicon) {
        this.getLexicons().push(lexicon);
        this.getUsedLexicons().push(1);
    }

    toggleLexicon(index) {
        this.getUsedLexicons()[index] = !this.getUsedLexicons()[index];
    }

    addRefVariable(variable) {
        this.getUsedVariables().addRefVariable(variable);
    }

    addVariable(name, value) {
        this.getUsedVariables().addVariable(name, value);
    }

    initialize() {
        this.setUnknownStream(new String());
        this.setCurrentStream(new String());
        this.setPreviousStream(new String());

        this.setIsStructure(0);
        this.setIsToken(0);
        this.setIsVariable(0);

        this.setWasStructure(0);
        this.setWasToken(0);
        this.setWasVariable(0);

        this.defineUsedContent();

        this.setCurrentStructures(new Array());
        this.setPreviousStructures(new Array());

        this.setCurrentTokens(new Array());
        this.setPreviousTokens(new Array());

        this.setCurrentVariables(new Array());
        this.setPreviousVariables(new Array());

        this.setTokenOutput(new Array());
    }

    defineUsedContent() {
        let Ustructures = new Array();
        let Utokens = new Array();

        let ulHolder = this.getUsedLexicons();
        let lHolder = this.getLexicons();

        for (let i = 0, currentLexicon; i < ulHolder.length; i++) {
            if (!ulHolder[i]) {
                continue;
            }
            currentLexicon = lHolder[i];
            for (let l = 0; l < currentLexicon.getStructures().length; l++) {
                Ustructures.push(currentLexicon.getStructures()[l]);
            }
            for (let l = 0; l < currentLexicon.getTokens().length; l++) {
                Utokens.push(currentLexicon.getTokens()[l]);
            }
        }

        this.setUsedStructures(Ustructures);
        this.setUsedTokens(Utokens);
    }

    //Operations

    run(input) {
        this.initialize();

        for (let i = 0, current = input[i]; i <= input.length; i++) {
            if (i < input.length) {
                current = input[i];
                this.incrementCurrentStream(current);
            }
            else {
                this.setIsStructure(0);
                this.setIsToken(0);
                this.setIsVariable(0);

                this.unknownPush();
            }

            if (!this.getIsToken() && !this.getIsVariable()) {//If this is not a Token nor a Variable:
                if (this.getWasToken() || this.getWasVariable()) {//But used to Be:
                    let outputted = 0;
                    let toOutput;
    
                    for (let l = 0; l < this.getPreviousTokens().length; l++) {
                        if (this.getPreviousTokens()[l].getSymbol() == this.getPreviousStream()) {
                            toOutput = this.getPreviousTokens()[l];
                            outputted++;
                            break;
                        }
                    }
                    for (let l = 0; l < this.getPreviousVariables().length; l++) {
                        if (this.getPreviousVariables()[l].getName() == this.getPreviousStream()) {
                            toOutput = this.getPreviousVariables()[l];
                            outputted++;
                            break;
                        }
                    }
                    if (outputted > 0) {
                        this.unknownPush();
                        this.getTokenOutput().push(toOutput);
                    }
                    else {
                        this.setUnknownStream(this.getUnknownStream() + this.getPreviousStream());
                    }
                    this.setCurrentStream(new String());
                    i--;
                }
                else if (!this.getIsStructure() && this.getWasStructure()) {//But Used To Be a Structure:
                    this.unknownPush();
    
                    let prevStruc = this.getPreviousStructures()[0];
    
                    this.getTokenOutput().push(new Token(prevStruc.getName(), prevStruc.getType(), this.getPreviousStream()));
    
                    this.setCurrentStream(new String());
                    i--;
                }
    
            }

            this.cycleState();
        }

        return this.getTokenOutput();
    }

    incrementCurrentStream(char) {
        this.setCurrentStream(this.getCurrentStream() + char);

        if (this.getCurrentStream().length == 1) {//It is the First Iteration of this Stream
            this.firstStreamIteration(char);
        }
        else {//It is NOT the First Iteration of this Stream

            this.notFirstStreamIteration(char);
        }

    }

    firstStreamIteration(char) {
        this.setCurrentStructures(Lexicon.filterStructures(char, this.getUsedStructures()));
        this.setCurrentTokens(Lexicon.filterTokens(char, 0, this.getUsedTokens()));
        this.setCurrentVariables(VarList.filterVariables(char, 0, this.getUsedVariables().getVariables()));

        let count = 0;

        if (this.getCurrentStructures().length > 0) {
            this.setIsStructure(1);
            count++;
        }
        if (this.getCurrentTokens().length > 0) {
            this.setIsToken(1);
            count++;
        }
        if (this.getCurrentVariables().length > 0) {
            this.setIsVariable(1);
            count++;
        }
        if (count == 0) {
            this.setCurrentStream(new String());
            if (char != " ") {
                this.setUnknownStream(this.getUnknownStream() + char);
            }
            else {
                this.unknownPush();
            }
        }
    }

    notFirstStreamIteration(char) {
        let position = this.getCurrentStream().length - 1;

        if (this.getIsStructure()) {
            this.setCurrentStructures(Lexicon.filterStructures(char, this.getCurrentStructures()));
            if (this.getCurrentStructures().length == 0) {
                this.setIsStructure(0);
            }
        }
        if (this.getIsToken()) {
            this.setCurrentTokens(Lexicon.filterTokens(char, position, this.getCurrentTokens()));
            if (this.getCurrentTokens().length == 0) {
                this.setIsToken(0);
            }
        }
        if (this.getIsVariable()) {
            this.setCurrentVariables(VarList.filterVariables(char, position, this.getCurrentVariables()));
            if (this.getCurrentVariables().length == 0) {
                this.setIsVariable(0);
            }
        }
    }

    cycleState() {
        this.setWasStructure(this.getIsStructure());
        this.setWasToken(this.getIsToken());
        this.setWasVariable(this.getIsVariable());

        this.setPreviousStructures(this.getCurrentStructures());
        this.setPreviousTokens(this.getCurrentTokens());
        this.setPreviousVariables(this.getCurrentVariables());

        this.setPreviousStream(this.getCurrentStream());
    }

    unknownPush() {
        if (this.getUnknownStream().length > 0) {
            this.getTokenOutput().push(new Token("UNKNOWN", "UNKNOWN", this.getUnknownStream()));
            this.setUnknownStream(new String());
        }
    }

    printState() {
        console.log(`
        unknownStream:${this.getUnknownStream()}\n
        currentStream:${this.getCurrentStream()}\n
        previousStream:${this.getPreviousStream()}\n
        
        isStructure:${this.getIsStructure()}\n
        isToken:${this.getIsToken()}\n
        isVariable:${this.getIsVariable()}\n
        
        wasStructure:${this.getWasStructure()}\n
        wasToken:${this.getWasToken()}\n
        wasVariable:${this.getWasVariable()}\n

        currentStructures:${this.getCurrentStructures()}\n
        previousStructures:${this.getPreviousStructures()}\n

        currentTokens:${this.getCurrentTokens()}\n
        previousTokens:${this.getPreviousTokens()}\n

        currentVariables:${this.getCurrentVariables()}\n
        previousVariables:${this.getPreviousVariables()}
        `);
    }

    //Getters And Setters

    getLexicons() {
        return this.lexicons;
    }
    setLexicons(lexicons) {
        this.lexicons = lexicons;
    }

    getUsedLexicons() {
        return this.usedLexicons;
    }
    setUsedLexicons(usedLexicons) {
        this.usedLexicons = usedLexicons;
    }

    getUnknownStream() {
        return this.unknownStream;
    }
    setUnknownStream(unknownStream) {
        this.unknownStream = unknownStream;
    }

    getCurrentStream() {
        return this.currentStream;
    }
    setCurrentStream(currentStream) {
        this.currentStream = currentStream;
    }

    getPreviousStream() {
        return this.previousStream;
    }
    setPreviousStream(previousStream) {
        this.previousStream = previousStream;
    }

    getIsStructure() {
        return this.isStructure;
    }
    setIsStructure(isStructure) {
        this.isStructure = isStructure;
    }

    getIsToken() {
        return this.isToken;
    }
    setIsToken(isToken) {
        this.isToken = isToken;
    }

    getIsVariable() {
        return this.isVariable;
    }
    setIsVariable(isVariable) {
        this.isVariable = isVariable;
    }

    getWasStructure() {
        return this.wasStructure;
    }
    setWasStructure(wasStructure) {
        this.wasStructure = wasStructure;
    }

    getWasToken() {
        return this.wasToken;
    }
    setWasToken(wasToken) {
        this.wasToken = wasToken;
    }

    getWasVariable() {
        return this.wasVariable;
    }
    setWasVariable(wasVariable) {
        this.wasVariable = wasVariable;
    }

    getUsedStructures() {
        return this.usedStructures;
    }
    setUsedStructures(usedStructures) {
        this.usedStructures = usedStructures;
    }

    getCurrentStructures() {
        return this.currentStructures;
    }
    setCurrentStructures(currentStructures) {
        this.currentStructures = currentStructures;
    }

    getPreviousStructures() {
        return this.previousStructures;
    }
    setPreviousStructures(previousStructures) {
        this.previousStructures = previousStructures;
    }

    getUsedTokens() {
        return this.usedTokens;
    }
    setUsedTokens(usedTokens) {
        this.usedTokens = usedTokens;
    }

    getCurrentTokens() {
        return this.currentTokens;
    }
    setCurrentTokens(currentTokens) {
        this.currentTokens = currentTokens;
    }

    getPreviousTokens() {
        return this.previousTokens;
    }
    setPreviousTokens(previousTokens) {
        this.previousTokens = previousTokens;
    }

    getUsedVariables() {
        return this.usedVariables;
    }
    setUsedVariables(usedVariables) {
        this.usedVariables = usedVariables;
    }

    getCurrentVariables() {
        return this.currentVariables;
    }
    setCurrentVariables(currentVariables) {
        this.currentVariables = currentVariables;
    }

    getPreviousVariables() {
        return this.previousVariables;
    }
    setPreviousVariables(previousVariables) {
        this.previousVariables = previousVariables;
    }

    getTokenOutput() {
        return this.tokenOutput;
    }
    setTokenOutput(tokenOutput) {
        this.tokenOutput = tokenOutput;
    }
}