class CustomFailureApp < Devise::FailureApp
  def respond
    if request.format.json?
      self.status = 401
      self.content_type = 'application/json'
      self.response_body = { error: i18n_message }.to_json
    else
      super
    end
  end
end 