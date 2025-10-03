fn main(
    threshold: u64,
    nonce: Field,     
    balance: u64,         
    secret_nonce: Field   
) {
    assert(nonce == secret_nonce);
    assert(balance >= threshold);
}