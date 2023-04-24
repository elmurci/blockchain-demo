/////////////////////////
// global variable setup
/////////////////////////

// number of zeros required at front of hash
var difficultyMajor = 4;

// 0-15, maximum (decimal) value of the hex digit after the front
// 15 means any hex character is allowed next
// 7  means next bit must be 0 (because 0x7=0111),
//    (so the bit-strength is doubled)
// 0  means only 0x0 can be next
//    (equivalent to one more difficultyMajor)
var difficultyMinor = 15;  

var maximumNonce = 8;  // limit the nonce so we don't mine too long
var pattern = '';
for (var x=0; x<difficultyMajor; x++) {
  pattern += '0';     // every additional required 0
  maximumNonce *= 16; // takes 16x longer to mine
}
// at this point in the setup, difficultyMajor=4
// yields pattern '0000' and maximumNonce 8*16^4=524288

// add one more hex-char for the minor difficulty
pattern += difficultyMinor.toString(16);
var patternLen = pattern.length; // == difficultyMajor+1

if      (difficultyMinor == 0) { maximumNonce *= 16; } // 0000 require 4 more 0 bits
else if (difficultyMinor == 1) { maximumNonce *= 8;  } // 0001 require 3 more 0 bits
else if (difficultyMinor <= 3) { maximumNonce *= 4;  } // 0011 require 2 more 0 bits
else if (difficultyMinor <= 7) { maximumNonce *= 2;  } // 0111 require 1 more 0 bit
// else don't bother increasing maximumNonce, it already started with 8x padding



/////////////////////////
// functions
/////////////////////////
function sha256(block, chain) {
  // calculate a SHA256 hash of the contents of the block
  return CryptoJS.SHA256(getText(block, chain));
}

function updateState(block, chain) {
  // set the well background red or green for this block
  if ($('#block'+block+'chain'+chain+'hash').val().substr(0, patternLen) <= pattern) {
    $('#block'+block+'chain'+chain+'well').removeClass('well-error').addClass('well-success');
  }
  else {
    $('#block'+block+'chain'+chain+'well').removeClass('well-success').addClass('well-error');
  }
}

function updateHash(block, chain, update = true) {
  // update the SHA256 hash value for this block
  $('#block'+block+'chain'+chain+'hash').val(sha256(block, chain));
  if (update) updateState(block, chain);
}

function updateChain(block, chain) {
  let invalidBlocksFrom = -1;
  // update all blocks walking the chain from this block to the end
  console.log("updateChain", block, chain)
  for (var x = block; x <= 5; x++) {
    if (x > 1) {
      // $('#block'+x+'chain'+chain+'previous').val($('#block'+(x-1).toString()+'chain'+chain+'hash').val());
    }
    if (x >= block) {
      $('#block'+x+'chain'+chain+'well').removeClass('well-success').addClass('well-error');
      $('#block'+x+'chain'+chain+'line').removeClass('blockchain-line-good').addClass('blockchain-line-bad');
    }
    // console.log($('#block'+x+'chain'+chain+'previous').val(), "!==", $('#block'+(x-1).toString()+'chain'+chain+'hash').val())
    // if ((invalidBlocksFrom > 0 && x > invalidBlocksFrom) || $('#block'+x+'chain'+chain+'previous').val() !== $('#block'+(x-1).toString()+'chain'+chain+'hash').val()) {
    //   console.log('#block'+x+'chain'+chain+'well', 'RED')
    //   $('#block'+x+'chain'+chain+'well').removeClass('well-success').addClass('well-error');
    //   // All the blocks in read from now on
    //   invalidBlocksFrom = x;
    //   // (x, chain, false);
    // } else {
    //   // updateHash(x, chain);
    // }
  }
  $('#block'+(block-1)+'chain'+chain+'line').removeClass('blockchain-line-good').addClass('blockchain-line-bad');
}

function mine(block, chain, isChain) {
  $('#block'+block+'chain'+chain+'nonce').val(block);
  $('#block'+block+'chain'+chain+'previous').val(block !== 1 ? $('#block'+(block-1)+'chain'+chain+'hash').val() : '0000000000000000000000000000000000000000000000000000000000000000');
  $('#block'+block+'chain'+chain+'hash').val(sha256(block, chain));
  $('#block'+block+'chain'+chain+'well').removeClass('well-error').addClass('well-success');
  $('#block'+(block-1)+'chain'+chain+'line').removeClass('blockchain-line-bad').addClass('blockchain-line-good');
  console.log("PAOC", '#block'+(block-1)+'chain'+chain+'line')
  // for (var x = 0; x <= maximumNonce; x++) {
  //   $('#block'+block+'chain'+chain+'nonce').val(x);
  //   $('#block'+block+'chain'+chain+'hash').val(sha256(block, chain));
    
  //   // if (isChain) {
  //   //   updateChain(block, chain);
  //   // }
  //   // else {
  //   //   updateState(block, chain);
  //   // }
  //   break;
  // }
}
