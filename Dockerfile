# Use PHP with Apache
FROM php:8.2-apache

# Enable Apache mod_rewrite for clean URLs
RUN a2enmod rewrite

# Set the working directory
WORKDIR /var/www/html

# Copy all project files to the container
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Install the custom VirtualHost config with rewrite rules built-in
COPY apache-site.conf /etc/apache2/sites-available/000-default.conf

# Also set AllowOverride in main apache2.conf as a fallback for .htaccess
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Add ServerName to suppress warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Configure Apache to use the PORT env variable (required by Render.com)
# Render sets PORT env var (usually 10000) and routes traffic to it
RUN sed -i 's/Listen 80/Listen ${APACHE_PORT}/' /etc/apache2/ports.conf

# Set default port (Render will override via PORT env var)
ENV APACHE_PORT=10000

# Create a startup script that reads Render's PORT and starts Apache
RUN printf '#!/bin/bash\n\
# Use Render PORT env var, fallback to 10000\n\
export APACHE_PORT="${PORT:-10000}"\n\
exec apache2-foreground\n' > /usr/local/bin/start-apache.sh \
    && chmod +x /usr/local/bin/start-apache.sh

# Expose the port (Render uses PORT env var, this is just documentation)
EXPOSE 10000

# Start Apache using our startup script
CMD ["start-apache.sh"]
