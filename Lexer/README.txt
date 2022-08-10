╔════════════════════════════════╗
║    Lexer.js Usage Description  ║
╚════════════════════════════════╝

Lexer.js is a Collection of Tools and Structures destined to aid in any Basic Lexic Analisys.
The intended usage would be to read a Simple String, to return a set of tokens, based on the used String and Lexicon.

Structures:

Variable
Is a Simple Variable That Stores a 'Name'(String), and a 'Value'(Any).
Intended for changing or reading the value post Analisys.
The Name is The Only Thing Used To Be Identified In The Lexer.



VarList:
Simply put, is a Variable List.
Mostly used to store multiple Variables.



AbstractToken:
AbstractToken Is the Non Instanciable, Simpler Version of a Token, Used only to extend Tokens and Token Structures.
It contains a 'Name'(String) and a 'Type'(String) Variables.
It also contains a pair of Methods, that need to be implemented:
check(input) <- Checks if the Whole string is equal to the input
compare(input, position) <- Checks if the string fragment is equal to the input



Token:
Token is an Extention of the AbstractToken class, containing a aditional 'Symbol'(String).
The Intended usage for this class is to serve as a structure for the Lexer output and a basis for Lexicon's Tokens.
(Example of a token):
Name    :   PLUS
Type    :   Operation
Symbol  :   +



TokenStructure:
TokenStructure is an Extention of the AbstractToken class.
It contains three aditional Attributes, being:
'symbols'(Array of Strings): A Collection of Symbols Fragments.
'extended'(TokenStructure): A Reference To Another Existing TokenStructure.
'isExtended'(Integer): A Makeshift Boolean Value (0 : False)(1 : True), That Indicates if this Instance Have or Not a Reference.
The Intended usage for the TokenStructure is to create tokens with multiple Symbols that fit in the same category.
(Example):
Name        :   Decimal
Type        :   Number
Symbols     :   "0,"1","2","3","4","5","6","7","8","9"
Extended    :   Null
isExtended  :   0
(Another Example):
Name        :   Hexadecimal
Type        :   Number
Symbols     :   "A","B","C","D","E","F"
Extended    :   Decimal
isExtended  :   1



Lexicon:
Lexicon is a Collection of Tokens and Structures.
It Contains a 'Name'(String),'Tokens'(Array) and a 'Structures'(Array).
The Intended usage for the Lexicon class is to serve as a "Book of Known Words" by holding multiple tokens and structures to be used in the lexer.
It is advisable to use only tokens and structures related to each other, like a Number structure with a arithimetic operation set of tokens.


Lexer:
Lexer is the runner of the Lexic Analisys Algorithm, it can be using by executing the "Run" function.
It will use the Lexicons Asigned to it (If Active) and the VarList.
The Lexer Must Be Instanced.
(Example of Usage):
Input:
"2 + 2 != 5"

Output:
(Decimal    ,Number     ,"2")
(Plus       ,Operation  ,"+")
(Decimal    ,Number     ,"2")
(Different  ,Operation  ,"!=")
(Decimal    ,Number     ,"5")

The Output is intended to be used in a Custom "Parser" to be functional.