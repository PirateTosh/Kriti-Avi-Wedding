<div className="panel panel-default">
    <div className="panel-heading">
        <h4 className="panel-title">
            <Link className="accordion-toggle" data-toggle="collapse" data-parent="#accordion" to="#MYDETAILS" ><i className="glyphicon glyphicon-home"></i>
                MY DETAILS <i class="glyphicon glyphicon-ok" style={{ marginLeft: '10px' }}></i>
            </Link>
        </h4>
    </div>
    <div id="MYDETAILS" className="panel-collapse collapse ">
        <div className="panel-body">
            <div className="row">
                <div className="col-md-6 col-sm-6 col-xs-6" style={{ paddingLeft: '5%' }}>
                    <button className="ankurbtn pull-right">ANKUR</button><br />
                    <select class="form-control">
                        <option value="Mr" className="active">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="text" class="form-control" id="nameid" placeholder="Name" value={this.state.name} onBlur={this.validName.bind(this)} onChange={this.checkName.bind(this)}/>
                    <span id="ErrorName" style={{color:'white'}}></span>
                    <input type="text" class="form-control" id="Mnameid" placeholder="Middle Name" value={this.state.Mname} onBlur={this.validMName.bind(this)} onChange={this.checkMName.bind(this)} />
                    <span id="ErrorMName" style={{color:'white'}}></span>
                    <input type="text" class="form-control" id="Lnameid" placeholder="Last Name" value={this.state.Lname} onBlur={this.validLName.bind(this)} onChange={this.checkLName.bind(this)}/>
                    <span id="ErrorLName" style={{color:'white'}}></span>
                </div>
                <div className="col-md-6 col-sm-6 col-xs-6" style={{ paddingRight: '5%' }}>
                    <button className="manishabtn pull-left">MANISHA</button><br />
                    <input type="email" class="form-control" id="emailid" aria-describedby="emailHelp" placeholder="Enter email" value={this.state.email} onBlur={this.validEmail.bind(this)} onChange={this.checkEmail.bind(this)}/>
                    <span id="ErrorEmail" style={{color:'white'}}></span>
                    <input type="text" class="form-control" id="numberid" placeholder="number" value={this.state.number}  onBlur={this.validNumber.bind(this)} onChange={this.checkNumber.bind(this)}/>
                    <span id="NumberError" style={{color:'white'}}></span>
                    <DatePicker className="form-control" placeholderText="Brithday" selected={this.state.startDate}  onChange={this.handleChange} size="1000"/>
                    <input type="text" class="form-control" id="countrynameid" placeholder="Country" value={this.state.country}  onBlur={this.validCountry.bind(this)} onChange={this.checkCountry.bind(this)}/>
                    <span id="ErrorCountry" style={{color:'white'}}></span>
                </div>
                <button className="manishabtn" style={{ marginLeft: '42%', marginTop: '15px' }}>UPDATE</button><br />
            </div>
        </div>
    </div>
</div>
<div className="panel panel-default">
    <div className="panel-heading">
    <h4 className="panel-title">
    <Link className="accordion-toggle" data-toggle="collapse" data-parent="#accordion" to="#MYADDRESS"><i className="glyphicon glyphicon-home"></i>
MY ADDRESS <i class="glyphicon glyphicon-ok" style={{ marginLeft: '10px' }}></i>
</Link>
</h4>
</div>
<div id="MYADDRESS" className="panel-collapse collapse">
    <div className="panel-body">
        <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-6"style={{ paddingLeft: '5%' }}>
                <input type="text" class="form-control" id="Aline1" placeholder="ADDRESS LINE1"  value={this.state.addressLine1} onBlur={this.validALine1.bind(this)} onChange={this.checkALine1.bind(this)}/>
                <span id="ErrorAline1" style={{color:'white'}}></span>
                <input type="text" class="form-control" id="city" placeholder="CITY" value={this.state.city} onBlur={this.validCity.bind(this)} onChange={this.checkCity.bind(this)}/>
                <span id="ErrorCity" style={{color:'white'}}></span>
                <input type="text" class="form-control" id="pincode" placeholder="PINCODE"  value={this.state.pincode} onBlur={this.validPincode.bind(this)} onChange={this.checkPincode.bind(this)}/>
                <span id="ErrorPincode" style={{color:'white'}}></span>
                <select class="form-control">
                    <option value="false" className="active">NEAREST AIRPORT</option>
                    <option value="DELHI">DELHI</option>
                    <option value="MUMBAI">MUMBAI</option>
                </select>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-6" style={{ paddingRight: '5%' }}>
            <input type="text" class="form-control" id="Aline2" placeholder="ADDRESS LINE2" value={this.state.addressLine2} onBlur={this.validALine2.bind(this)} onChange={this.checkALine2.bind(this)}/>
            <span id="ErrorAline2" style={{color:'white'}}></span>
            <input type="text" class="form-control" id="state" placeholder="STATE"  value={this.state.state} onBlur={this.validState.bind(this)} onChange={this.checkState.bind(this)}/>
            <span id="ErrorState" style={{color:'white'}}></span>
            <input type="text" class="form-control" id="Lmark" placeholder="LANDMARK" />
            <div className="row" style={{marginTop:'6%'}}>
            <div className="col-sm-5 col-md-5 col-xs-5">
            <span>Travelling from </span><br/> <span>The same airport </span>
        </div>
        <div className="col-sm-7 col-md-7 col-xs-7" >
            <button className="MyaddressBtn">YES</button>
            <button className="MyaddressBtn">NO</button>
            <button className="MyaddressBtn">OTHER</button>
            </div>
        </div>
    </div>
    <div className="row">
        <div className="col-md-4 col-sm-4 col-xs-4"></div>
        <div className="col-md-4  col-sm-4 col-xs-4">
            <label class="btn-bs-file ">
                UPLOAD PHOTO ID
                <input type="file" id="fileId" onChange={this.fileValidation.bind(this)}/>

            </label>
            <span id="fileError" style={{color:'white'}}></span>
        </div>
        <div className="col-md-4  col-sm-4 col-xs-4"></div>
    </div>

    <button className="manishabtn" style={{ marginLeft: '42%', marginTop: '15px' }}>SAVE</button><br />
</div>
</div>
</div>
</div>
<div className="panel panel-default">
    <div className="panel-heading">
        <h4 className="panel-title">
            <Link className="accordion-toggle" data-toggle="collapse" data-parent="#accordion" to="#MYPASSPORT"><i className="glyphicon glyphicon-home"></i>
                MY PASSPORT <i class="glyphicon glyphicon-ok" style={{ marginLeft: '10px' }}></i>
            </Link>
        </h4>
    </div>
    <div id="MYPASSPORT" className="panel-collapse collapse">
        <div className="panel-body">
            <div className="row">
                <div className="col-md-6 col-sm-6" style={{ paddingLeft: '40px' }}>
                    <button className="ankurbtn pull-right">ANKUR</button><br />
                </div>
                <div className="col-md-6 col-sm-6" style={{ paddingRight: '40px' }}>
                    <button className="manishabtn pull-left">MANISHA</button><br />
                </div>
            </div>
            <div className="row">
                <p style={{ textAlign: 'center' }}>DO YOU HAVE A VALID PASSPORT</p>
                <div className="col-md-6 col-sm-6">
                    <button className="ankurbtn yes pull-right">YES</button><br />
                </div>
                <div className="col-md-6 col-sm-6">
                    <button className="manishabtn  yes pull-left">NO</button><br />
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 col-sm-4 col-xs-4"></div>
                <div className="col-md-4  col-sm-4 col-xs-4">
                    <label class="btn-bs-file ">
                        UPLOAD PASSPORT
                        <input type="file" id="PfileId" onChange={this.PfileValidation.bind(this)}/>
                        </label>
                        <span id="PfileError" style={{color:'white'}}></span>
                        </div>

                        <div className="col-md-4  col-sm-4 col-xs-4"></div>
                        </div>
                        <br />
                        <button className="manishabtn" style={{ marginLeft: '42%', marginTop: '15px' }}>SAVE</button><br />
                        </div>
                </div>
            </div>